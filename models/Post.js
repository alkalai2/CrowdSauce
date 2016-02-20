// This is tentative but seems like a good way to serialize Posts
var path = require('path')
var config = require('../config.js')
var thinky = require('thinky')(config.rethinkdb);
var r = thinky.r;
var type = thinky.type;


// This should model the schema we want in our RethinkDB
var Post = thinky.createModel("posts", {
    userId: type.string(),
    ingredients: type.string(),
    directions: type.string(),
    recipeLink: type.string(),
    imageLinks: type.string(),
    timePosted: type.date().default(r.now()),
    tags: type.array(),
    notes: type.string(),
    rating: type.number()

}); 

/*var postSchema = mongoose.Schema({
  createdBy: {type: mongoose.Schema.ObjectId, required: true, index: true},
  creationDate: {type: Date, 'default': Date.now},
  lastUpdate: {type: Date, 'default': Date.now}
})

var Post = mongoose.model('Post', postSchema)*/

module.exports = Post
