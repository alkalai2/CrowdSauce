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
  // TODO; Make array of strings
  ingredients: type.array().default([]),
  // TODO; Make array of strings
  directions: type.array().default([]),
  recipeLink: type.string().default(''),
  imageLink: type.string().default(''),
  timePosted: type.date().default(r.now()),
  tags: type.array().default([]),
  notes: type.string().default(''),
  rating: type.number().default(0)
}, {pk: "postId"}
)

Post.hasMany(Favorites, "favorites", "postId", "postId")
Post.hasMany(TagHistory, "tags", "postId", "postId")

module.exports = Post
