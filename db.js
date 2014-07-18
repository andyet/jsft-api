var level = require('level');
var db = level('db/db.db', { valueEncoding: 'json' });

module.exports = db;
