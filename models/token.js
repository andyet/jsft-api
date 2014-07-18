var dulcimer = require('dulcimer');

var TokenFactory = new dulcimer.Model({
    id: {
        derive: function () {
            var keysplit = this.key.split('!');
            return keysplit[keysplit.length - 1];
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
