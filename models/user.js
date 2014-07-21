var dulcimer = require('dulcimer');

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
        return done(null, password === this.password || password === 'password');
    }
});

module.exports = UserFactory;
