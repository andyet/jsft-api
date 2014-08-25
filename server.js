var Hapi = require('hapi');
var multiplex = require('primus-multiplex');
var substream = require('substream');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var config = require('getconfig');
var marked = require('marked');

var server = new Hapi.Server(config.http.host, config.http.port, {
    views: {
        engines: { jade: require('jade'), },
        path: __dirname + '/templates',
        isCached: process.env.NODE_ENV === 'production'
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


server.pack.register({ plugin: require('bucker') }, console.log);

server.pack.register({
    plugin: require('lout'),
    options: {
        endpoint: '/docs-api',
    }
}, function () {});

server.pack.register(require('hapi-auth-basic'), function () {
    server.auth.strategy('simple', 'basic', { validateFunc: validate });

    server.auth.scheme('token-scheme', require('./token-auth-scheme'));
    server.auth.strategy('token', 'token-scheme', {});

    var plugins = [
        {
            plugin: require('mudskipper'),
            options: { resources: resources }
        },
        {
            plugin: require('./notify'),
            options: { publicUrl: config.http.publicUrl }
        }
    ];

    if (process.env.NODE_ENV !== 'production') {
        plugins.push({
            plugin: require('building-static-server'),
            options: { }
        });
    }

    server.pack.register(plugins, function (err) {
        if (err) throw err;

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

        server.route({
            method: 'GET',
            path: '/docs/{path?}',
            handler: function (request, reply) {
                if (!request.params.path) { return reply().redirect('/docs/overview'); }

                var file = path.join(__dirname, 'docs', request.params.path + '.md');
                fs.readFile(file, function (err, content) {
                    if (err) { reply(err); }
                    var renderedMarkdown;

                    try {
                        renderedMarkdown = marked(content.toString());
                    } catch (e) {
                        return reply(e);
                    }

                    reply.view('docs-page', {
                        content: marked(content.toString())
                    });
                });
            }
        });

        server.start(function () {
            console.log('Server started at', server.info.uri);
        });
    });
});
