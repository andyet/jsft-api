var Token = require('./models/token');
var hapi = require('hapi');

module.exports = function (server, options) {
    return {
        authenticate: function (request, reply) {
            console.log(request, reply);
            var tokenId = request.headers['auth-token'];

            if (!tokenId) return reply(hapi.error.badRequest("No 'Auth-Token' header provided"));

            Token.get(tokenId, function (err, token) {
                if (err) return reply(hapi.error.badRequest("Invalid 'Auth-Token' header"));

                reply(false, { credentials: token.user });
            });
        }
    };
};
