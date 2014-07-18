var Tweets = require('../models/tweet');
var User = require('../models/user');

module.exports = {
    index: {
        handler: function (request, reply) {
            var username = request.params.user_id;
            var response = function (err, tweets) {
                if (err) {
                    console.log('Error', err);
                    reply(new Error(err));
                } else {
                    reply(tweets);
                }
            };

            User.findByIndex('username', username, function (err, user) {
                if (err || !user) {
                    console.log('Error', err);
                    return reply(new Error(err || 'No user found'));
                }

                Tweets.findMentioning(user.id, response);
            });
        }
    }
};
