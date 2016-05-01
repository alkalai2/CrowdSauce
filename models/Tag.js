var path = require('path')
var config = require('../config.js')
var thinky = require('thinky')(config.rethinkdb);
var r = thinky.r;
var type = thinky.type;
var TagHistory = require('../models/TagHistory')

// This should model the schema we want in our RethinkDB
var Tag = thinky.createModel("tags", {
  tagName: type.string()
}, {pk: "tagName"})

// A tag can be added to many posts
// All posts with a given tagName will be in the taggedPosts field that can be used when querying the db
Tag.hasMany(TagHistory, "taggedPosts", "tagName", "tagName")

module.exports = Tag
