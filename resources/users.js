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

        if ( (!user.username || user.username.trim() === '') || (!user.password || user.password.trim() === '')) {
            return reply().redirect('/signup?err=' + encodeURIComponent('username and password are both required') + '&username=' + encodeURIComponent(user.username || ''));
        }

        User.findByIndex('username', user.username, function (err, existingUser) {

            if (existingUser) {
                var errMessage = 'A wolf with username ' + user.username + ' already exists';
                return reply().redirect('/signup?err=' + encodeURIComponent(errMessage));
            }

            user.save(function (err) {
                if (err) return reply(new Error(err));

                reply.view('registered', { username: user.username });
            });
        });
    },

    show: {
        handler: function (request, reply) {
            var username = request.params.wolf_id;

            if (username === 'me') {
                if (!request.auth.credentials) {
                    console.log('Not logged in');
                    reply(new Error('Not logged in'));
                } else {
                    reply(request.auth.credentials);
                }
            } else {
                User.findByIndex('username', username, function (err, user) {
                    if (err) {
                        console.log('Error finding', username, err);
                        return reply(new Error(err));
                    }

                    if (!user) {
                        console.log('No user with username', username);
                        return reply(new Error('No user with username', username));
                    }

                    console.log('Found user', user);
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
