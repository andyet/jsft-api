var dulcimer = require('dulcimer');
var _ = require('underscore');
var events = require('events');

var TweetFactory = new dulcimer.Model({
    id: {
        derive: function () {
            return this.key;
        }
    },

    content: {},

    createdAt: {
        type: 'string',
        required: true,
        default: function () { return new Date(); },
        processOut: function (value) {
            return value.toString();
        }
    },

    user: {
        foreignKey: 'user',
        index: true
    },

    mentions: {
        private: true,
        type: 'array'
    }
}, {
    name: 'tweet',
    keyType: 'uuid',
    savePrivate: true,
    onSave: function (err, details, done) {
        TweetFactory.events.emit('save', details.model);
        done();
    }
});

TweetFactory.events = new events.EventEmitter();

TweetFactory.findMentioning = function (userId, done) {
    TweetFactory.all(function (err, tweets) {
        if (err) return done(err);

        var mentioning = tweets.filter(function (tweet) {
            return _.flatten(tweet.mentions).some(function (mention) {
                return mention === userId;
            });
        });

        done(null, mentioning);
    });
};

module.exports = TweetFactory;
