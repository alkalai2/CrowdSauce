var path = require('path')
var config = require('../config.js')
var thinky = require('thinky')(config.rethinkdb)
var r = thinky.r
var type = thinky.type
var Favorites = require('../models/Favorites')
var TagHistory = require('../models/TagHistory')


// This should model the schema we want in our RethinkDB
var Post = thinky.createModel('posts', {
  userId: type.number().default(0),
  title: type.string().default(''),
  ingredients: type.array().default([]),
  directions: type.array().default([]),
  recipeLink: type.string().default(''),
  images: type.array().default([]),
  timePosted: type.date().default(r.now()),
  notes: type.string().default(''),
  rating: type.number().default(0),
  prepTime: type.number().default(0),
  difficulty: type.string().enum(["easy", "medium", "hard"]).default("easy")
}, {pk: "postId"})

module.exports = Post

// this line has to be here otherwise the circular import will not work
// Post requires Account and Account requires Post
var Account = require('../models/Account')
Post.belongsTo(Account, "user", "userId", "userId")
Post.hasMany(Favorites, "favorites", "postId", "postId")
Post.hasMany(TagHistory, "tags", "postId", "postId")
