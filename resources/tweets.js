var Tweets = require('../models/tweet');
var User = require('../models/user');
var findMentions = require('../find-mentions');
var _ = require('underscore');



module.exports = {
    index: {
        handler: function (request, reply) {
            var username = request.params.wolf_id;
            var limit = request.query.limit && parseInt(request.query.limit, 10);

            var response = function (err, tweets) {
                if (err) {
                    console.log('Error', err);
                    reply(new Error(err));
                } else {
                    reply(tweets);
                }
            };

            if (!username) {
                var options = {};
                options.limit = limit || 50;
                options.sortBy = 'createdAt';
                options.reverse = true;
                Tweets.all(options, response);
            } else {
                User.findByIndex('username', username, function (err, user) {
                    if (err || !user) {
                        console.log('Error', err);
                        return reply(new Error(err || 'No user found'));
                    }

                    Tweets.getByIndex('user', user.id, response);
                });
            }
        }
    },

    show: {
        handler: function (request, reply) {
            Tweets.get(request.params.howl_id, function (err, tweet) {
                if (err) return reply(new Error(err));
                reply(tweet);
            });
        }
    },

    create: {
        handler: function (request, reply) {
            var tweet = Tweets.create(request.payload);
            tweet.user = request.auth.credentials.id;
            tweet.createdAt = new Date().valueOf().toString();

            findMentions(tweet.content, function (err, ids) {
                if (err) return reply(new Error(err));

                tweet.mentions = ids;

                tweet.save(function (err) {
                    if (err) return reply(new Error(err));

                    //To rehydrate with nested user
                    Tweets.get(tweet.id, function (Err, tweet) {
                        if (err) return reply(new Error(err));
                        reply(tweet);
                    });
                });
            });

        },
        config: {
            auth: 'token'
        }
    }
};
