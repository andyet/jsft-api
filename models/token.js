var dulcimer = require('dulcimer');

var TokenFactory = new dulcimer.Model({
    id: {
        derive: function () {
            return this.key;
        }
    },
    user: { 
        foreignKey: 'user',
        index: true
    },
}, {
    name: 'token',
    keyType: 'uuid'
});

module.exports = TokenFactory;
