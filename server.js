var Hapi = require('hapi');
var multiplex = require('primus-multiplex');
var substream = require('substream');
var _ = require('underscore');
var config = require('getconfig');

var server = new Hapi.Server(config.http.host, config.http.port, {
    views: {
        engines: { jade: require('jade') },
        path: __dirname + '/templates'
    },
    cors: {
        origin: ['*'],
        headers: ['Authorization', 'Content-Type', 'If-None-Match', 'Auth-Token']
    }
});

var resources = {
    wolves: require('./resources/users'),
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


server.pack.register(require('lout'), function () {});
server.pack.register(require('hapi-auth-basic'), function () {
    server.auth.strategy('simple', 'basic', { validateFunc: validate });

    server.auth.scheme('token-scheme', require('./token-auth-scheme'));
    server.auth.strategy('token', 'token-scheme', {});

    server.pack.register([
        {
            plugin: require('mudskipper'),
            options: { resources: resources }
        },
        {
            plugin: require('./notify'),
            options: { publicUrl: config.http.publicUrl }
        }
    ], function (err) {
        if (err) throw err;

        Tweet.all(function (err, tweets) {
            if (err) return;
            tweets.forEach(function (t) {
                if (t.createdAt.valueOf() > 1405888420516) {
                    t.delete(function (err) {
                        console.log(err);
                    });
                }
            });
        });

        server.route(require('./resources/auth')());
        server.route(require('./resources/client')());
        server.route({
            method: 'GET',
            path: '/public/{param*}',
            handler: {
                directory: {
                    path: 'public'
                }
            }
        });

        server.start(function () {
            console.log('Server started at', server.info.uri);
        });
    });
});
