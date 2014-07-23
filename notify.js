var Stream = require('stream');
var _ = require('underscore');

var Tweets = require('./models/tweet');
var User = require('./models/user');


module.exports.register = function (plugin, options, next) {
    var routes = [];
    var channelNameForUser = function (userId, channelType, done) {
        User.get(userId, function (err, user) {
            if (err) console.error(err);

            var channel = options.publicUrl + '/wolves/' + user.username + '/' + channelType;
            done(null, channel);
        });
    };

    var tweetChannel = new Stream.PassThrough();
    tweetChannel.sendNotification = function (data) {
        console.log('Write', data);
        this.write('data: ' + JSON.stringify(data) + '\n\n');       
    };

    var pushHowl = function (model) {
        tweetChannel.sendNotification({
            action: 'update',
            channel: options.publicUrl + '/howls',
            url: options.publicUrl + '/howls/' + model.id
        });
    };

    var pushUserHowl = function (model) {
        channelNameForUser(model.user, 'howls', function (err, channelName) {
            if (err) return console.log(err);

            tweetChannel.sendNotification({
                action: 'update',
                channel: channelName,
                url: options.publicUrl + '/howls/' + model.id
            });
        });
    };

    var pushUserMarks = function (model) {
        _.flatten(model.mentions).forEach(function (userId) {
            channelNameForUser(userId, 'marks', function (err, channelName) {
                tweetChannel.sendNotification({
                    action: 'update',
                    channel: channelName,
                    url: options.publicUrl + '/howls' + model.id
                });
            });
        });
    };

    Tweets.events.on('save', function (model) {
        pushHowl(model);
        pushUserHowl(model);
        pushUserMarks(model);
    });

    plugin.route({
        method: 'GET',
        path: '/notify',
        handler: function (request, reply) {
            var response = reply(tweetChannel);
            response.code(200)
                    .type('text/event-stream')
                    .header('Connection', 'keep-alive')
                    .header('Cache-Control', 'no-cache')
                    .header('Content-Encoding', 'identity');
        }
    });

    next();
};

module.exports.register.attributes = {
    name: 'Notify',
    version: '0.0.1'
};
