// This is tentative but seems like a good way to serialize Posts
var mongoose = require('mongoose')

// This should model the schema we want in our RethinkDB
var postSchema = mongoose.Schema({
  createdBy: {type: mongoose.Schema.ObjectId, required: true, index: true},
  creationDate: {type: Date, 'default': Date.now},
  lastUpdate: {type: Date, 'default': Date.now}
})

var Post = mongoose.model('Post', postSchema)

module.exports = Post
