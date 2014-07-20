var User = require('../models/user');

module.exports = {
    hasMany: ['howls', 'marks'],

    index: {
        handler: function (request, reply) {
            User.all(function (err, users) {
                if (err) return reply(new Error(err));
                reply(users);
            });
        }
    },

    create: function (request, reply) {
        var user = User.create(request.payload);

        user.save(function (err) {
            if (err) return reply(new Error(err));

            reply('ok');
        });
    },

    show: {
        handler: function (request, reply) {
            var username = request.params.user_id;

            if (username === 'me') { 
                if (!request.auth.credentials) {
                    reply(new Error('Not logged in'));
                } else {
                    reply(request.auth.credentials); 
                }
            } else {
                User.findByIndex('username', username, function (err, user) {
                    if (err) return reply(new Error(err));

                    if (!user) return reply(new Error('No user with username', username));

                    return reply(user);
                });
            }
        },
        config: {
            auth: {
                strategy: 'token',
                mode: 'try'
            }
        }
    }
};
