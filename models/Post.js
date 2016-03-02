// This is tentative but seems like a good way to serialize Posts
var path = require('path')
var config = require('../config.js')
var thinky = require('thinky')(config.rethinkdb)
var r = thinky.r
var type = thinky.type

// This should model the schema we want in our RethinkDB
var Post = thinky.createModel('posts', {
  userId: type.number().default(0),
  ingredients: type.string().default(''),
  directions: type.string().default(''),
  recipeLink: type.string().default(''),
  imageLinks: type.string().default(''),
  timePosted: type.date().default(r.now()),
  tags: type.array().default([]),
  notes: type.string().default(''),
  rating: type.number().default(0)
}, {pk: "postId"}
)

module.exports = Post
