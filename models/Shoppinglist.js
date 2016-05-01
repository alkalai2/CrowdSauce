var path = require('path')
var config = require('../config.js')
var thinky = require('thinky')(config.rethinkdb);
var r = thinky.r;
var type = thinky.type;

// This should model the schema we want in our RethinkDB
var Shoppinglist = thinky.createModel("shoppinglist", {
  userId: type.number().default(0),
  ingredients: type.array().default([])
}, {pk: "shoppinglistId"})

module.exports = Shoppinglist
