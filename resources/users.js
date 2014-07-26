var Joi = require('joi');
var User = require('../models/user');

module.exports = {
    hasMany: ['howls', {
        marks: require('./mentions')
    }],

    index: {
        handler: function (request, reply) {
            User.all(function (err, users) {
                if (err) return reply(new Error(err));
                reply(users);
            });
        },
        config: {
            description: "List all the wolves (users) with accounts.",
            notes: [
                '<pre>',
                '[',
                '    {',
                '        id: "36d872a1-4529-449a-8c83-64f86c20ab53",',
                '        username: "wawooo"',
                '    },',
                '    {',
                '        id: "68afc9e1-cb03-4fed-a91f-5521ebb4afc9",',
                '        username: "ike"',
                '    },',
                ']',
                '</pre>'
            ].join('\n')
        }
    },

    create: {
        handler: function (request, reply) {
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
        config: {
            description: "Create a new account",
            validate: {
                payload: {
                    username: Joi.string(),
                    password: Joi.string()
                }
            }
        }
    },

    show: {
        handler: function (request, reply) {
            var username = request.params.wolf_id;
            console.log(request.params);

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
            },
        }
    }
};
