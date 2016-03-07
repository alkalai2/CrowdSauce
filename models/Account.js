var path = require('path')
var config = require('../config.js')
var thinky = require('thinky')(config.rethinkdb);
var r = thinky.r;
var type = thinky.type;
var Favorites = require('../models/Favorites');

// This should model the schema we want in our RethinkDB
var Account = thinky.createModel("users", {
    userId: type.number().default(0),
    name: type.string().default("John Doe")
}, {pk: "userId"} );

Account.hasMany(Favorites, "favorites", "userId", "userId")

module.exports = Account
