var path = require('path')
var config = require('../config.js')
var thinky = require('thinky')(config.rethinkdb);
var r = thinky.r;
var type = thinky.type;
var Favorites = require('../models/Favorites');


// This should model the schema we want in our RethinkDB
var Account = thinky.createModel("users", {
  userId: type.number().default(0),
  name: type.string().default("John Doe"),
  email: type.string().default(""),
  picture: type.string().default("https://pbs.twimg.com/profile_images/619573624903761920/EGZ2I6wG.jpg"),
  blocked: type.array().default([]),
  notification: type.boolean().default(true),
  searchHistory: type.array().default([])
}, {pk: "userId"})

module.exports = Account

// this line has to be here otherwise the circular import will not work
// Post requires Account and Account requires Post
var Post = require('../models/Post');
Account.hasMany(Post, "posts", "userId", "userId")
Account.hasMany(Favorites, "favorites", "userId", "userId")

