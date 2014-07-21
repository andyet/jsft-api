var Tweets = require('../models/tweet');
var User = require('../models/user');
var findMentions = require('../find-mentions');

module.exports = {
    index: {
        handler: function (request, reply) {
            var username = request.params.wolf_id;
            var response = function (err, tweets) {
                if (err) {
                    console.log('Error', err);
                    reply(new Error(err));
                } else {
                    reply(tweets);
                }
            };

            if (!username) {
                Tweets.all(response);
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

    create: {
        handler: function (request, reply) {
            var tweet = Tweets.create(request.payload);
            tweet.user = request.auth.credentials.id;

            findMentions(tweet.content, function (err, ids) {
                if (err) return reply(new Error(err));

                tweet.mentions = ids;

                tweet.save(function (err) {
                    if (err) return reply(new Error(err));

                    reply(tweet);
                });
            });

        },
        config: {
            auth: 'token'
        }
    }
};
