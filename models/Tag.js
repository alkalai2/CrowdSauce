var path = require('path')
var config = require('../config.js')
var thinky = require('thinky')(config.rethinkdb);
var r = thinky.r;
var type = thinky.type;
var TagHistory = require('../models/TagHistory')

// This should model the schema we want in our RethinkDB
var Tag = thinky.createModel("tags", {
    tagName: type.string()
}, {pk: "tagName"});

Tag.hasMany(TagHistory, "taggedPosts", "tagName", "tagName")

module.exports = Tag
