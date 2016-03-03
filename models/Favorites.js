var path = require('path')
var config = require('../config.js')
var thinky = require('thinky')(config.rethinkdb);
var r = thinky.r;
var type = thinky.type;

// This should model the schema we want in our RethinkDB
var Favorites = thinky.createModel("favorites", {
    userId: type.string(),
    postIds: type.array()
}, {pk: "userId"} );

module.exports = Favorites
