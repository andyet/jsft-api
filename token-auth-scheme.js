var Token = require('./models/token');

module.exports = function (server, options) {
    return {
        authenticate: function (request, reply) {
            console.log(request, reply);
            var tokenId = request.headers['auth-token'];

            if (!tokenId) return reply(new Error('No auth'));

            Token.get(tokenId, function (err, token) {
                if (err) return reply(new Error(err));

                reply(false, { credentials: token.user });
            });
        }
    };
};
