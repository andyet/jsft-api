var async = require('async');
var User = require('./models/user');

module.exports = function (content, done) {
    var usernames = content.match(/@\w+/g);

    if (!usernames) return done(null, []);

    usernames = usernames.map(function (username) {
        return username.substr(1).toLowerCase();
    });

    async.map(usernames, function (username, next) {
        User.findByIndex('username', username, function (err, user) {
            if (err) user = null;

            return next(null, user);
        });
    }, function (err, users) {
        if (err) return done(err);
        users = users.filter(function (user) { return !!user; });

        done(null, users.map(function (u) { return u.id; }));
    });
};
