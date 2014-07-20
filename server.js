var Hapi = require('hapi');
var Primus = require('primus');
var multiplex = require('primus-multiplex');
var substream = require('substream');
var _ = require('underscore');
var config = require('getconfig');

var server = new Hapi.Server(config.http.host, config.http.port, {
    views: {
        engines: { jade: require('jade') },
        path: __dirname + '/templates'
    },
    cors: true
});

var resources = {
    wolves: require('./resources/users'),
    marks: require('./resources/mentions'),
    howls: require('./resources/tweets')
};

var validate = require('./validate-auth');

var dulcimer = require('dulcimer');
dulcimer.connect({
    type: 'level',
    path: __dirname + '/db',
    bucket: 'tweet-app'
});

var Tweet = require('./models/tweet');
var User = require('./models/user');

function channelNameForUser(userId, channelType, done) {
    User.get(userId, function (err, user) {
        if (err) console.error(err);

        var channel = '/users/' + user.username + '/' + channelType;
        done(null, channel);
    });
}

server.pack.register(require('hapi-auth-basic'), function () {
    server.auth.strategy('simple', 'basic', { validateFunc: validate });

    server.auth.scheme('token-scheme', require('./token-auth-scheme'));
    server.auth.strategy('token', 'token-scheme', {});

    server.pack.register([
        {
            plugin: require('mudskipper'),
            options: { resources: resources }
        },
    ], function (err) {
        if (err) throw err;

        var primus = new Primus(server.listener, { transformer: 'engine.io' });
        primus.use('substream', substream);

        primus.on('connection', function (spark) {
            Tweet.events.on('save', function (model) {
                spark.substream('/howls').write(model);

                channelNameForUser(model.user, 'howls', function (err, channelName) {
                    spark.substream(channelName).write(model);
                });

                _.flatten(model.mentions).forEach(function (userId) {
                    channelNameForUser(userId, 'marks', function (err, channelName) {
                        spark.substream(channelName).write(model);
                    });
                });
            });
        });

        server.route(require('./resources/auth')());
        server.route(require('./resources/client')());

        server.start(function () {
            console.log('Server started at', server.info.uri);
        });
    });
});
