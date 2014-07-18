var User = require('./models/user');

module.exports = function (username, password, done) {
    User.findByIndex('username', username, function (err, user) {
        if (err) {
            console.log('Error finding user by username');
            return done(err);
        }

        if (!user) {
            console.log('User not found by username');
            return done(null, false);
        }

        user.validatePassword(password, function (err, valid) {
            if (err || !valid) {
                console.log('Password invalid');
                return done(null, false);
            }

            return done(null, valid, user.toJSON());
        });
    });
};
