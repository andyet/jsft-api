var async = require('async');
var User = require('./models/user');

module.exports = function (content, done) {
    var usernames = content.match(/@\w+/g);

    if (!usernames) return done(null, []);

    usernames = usernames.map(function (username) {
        return username.substr(1);
    });

    async.map(usernames, function (username, next) {
        User.findByIndex('username', username, next);
    }, function (err, users) {
        if (err) return done(err);

        done(null, users.map(function (u) { return u.id; }));
    });
};
