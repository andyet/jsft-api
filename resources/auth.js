var User = require('../models/user');
var Token = require('../models/token');
var validateAuth = require('../validate-auth');

module.exports = function () {
    var routes = [];

    routes.push({
        method: 'GET',
        path: '/signup',
        handler: function (request, reply) {
            reply.view('signup', {
                err: request.query.err,
                username: request.query.username
            });
        }
    });

    routes.push({
        method: 'GET',
        path: '/authorize',
        handler: function (request, reply) {
            var client_id = request.query.client_id;
            var redirect_uri = request.query.redirect_uri || '';
            var response_type = request.query.response_type;

            reply.view('authorize', {
                client_id: client_id,
                redirect_uri: redirect_uri
            });
        }
    });

    routes.push({
        method: 'POST',
        path: '/authorize',
        handler: function (request, reply) {
            validateAuth(request.payload.username, request.payload.password, function (err, valid, user) {
                if (err) return reply(new Error(err));
                if (!valid) return reply(new Error('Invalid details'));

                var token = Token.create({ user: user.id });
                token.save(function (err) {
                    if (err) return reply(new Error(err));

                    reply().redirect(request.payload.redirect_uri + '#access_token=' + token.id);
                });
            });
        }
    });

    return routes;
};
