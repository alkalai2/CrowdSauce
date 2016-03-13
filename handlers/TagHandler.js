// Well need the model of account
var Tag = require('../models/Tag')
var Post = require('../models/Post')
var TagHistory = require('../models/TagHistory')
var config = require('../config.js')
var r = require('rethinkdb')
var auth = require('../auth.js')

var TagHandler = function () {
  this.createTag = handleCreateTagRequest
  this.addTag = handleAddTagRequest
  this.getPostTags = handleGetPostTagsRequest
  this.getTaggedPosts = handleGetTaggedPostsRequest
  this.getTags = handleGetTagsRequest
  this.updateTag = handleUpdateTagsRequest
  this.deleteTag = handleDeleteTagRequest
}

var connection = null;
r.connect( {host: config.rethinkdb.host, port: config.rethinkdb.port}, function(err, conn) {
    if (err) throw err;
    connection = conn
})

// called when a user logs in, add userId to DB if not present
// create Tag object, add data to DB using thinky
function handleCreateTagRequest (req, res) {
  if (!auth.assertHasUser(req)) return

  var tag = new Tag({tagName: req.body.tagName})

  // use Thinky to save Tag data
  tag.save().then(function (result) {
    res.send(200, JSON.stringify(result))
  }).error(function (error) {
    // something went wrong
    res.send(500, {error: error.message})
  })
}

function handleAddTagRequest (req, res) {
  if (!auth.assertHasUser(req)) return

  var tagHistory = new TagHistory({tagName: req.body.tagName, postId: req.body.postId})

  // use Thinky to save Tag data
  tagHistory.save().then(function (result) {
    res.send(200, JSON.stringify(result))
  }).error(function (error) {
    // something went wrong
    res.send(500, {error: error.message})
  })
}

function handleGetPostTagsRequest(req,res) {
  if (!auth.assertHasUser(req)) return

  //Pass in postId to query
  Post.get(req.query["postId"]).getJoin({tags: true}).run().then(function(post) {
    console.log("Result: "+ JSON.stringify(post))
    res.send(200, JSON.stringify(post.tags, null, 2))
  }).error(function (error) {
    // something went wrong
    console.log("Error: "+ error.message)
    res.send(500, {error: error.message})
  })
}

function handleGetTaggedPostsRequest(req,res) {
  //Pass in tagName in URL query
  Tag.get(req.query["tagName"]).getJoin({taggedPosts: true}).run().then(function(tag) {
      res.send(200, JSON.stringify(tag.taggedPosts, null, 2))
    }).error(function (error) {
    // something went wrong
    res.send(500, {error: error.message})
  })
}

function handleGetTagsRequest (req, res) {
  r.db(config.rethinkdb.db).table('tags').run(
          connection, function (err, cursor) {
            if (err) throw err
            cursor.toArray(function (err, result) {
              if (err) throw err
              res.send(200, JSON.stringify(result, null, 2))
          })
  })

}

function handleUpdateTagsRequest (req, res) {
  console.log('handleUpdateTagsRequest called with ' + JSON.stringify(req.route))
  // if (req.query.hasOwnProperty("tagName")){  r.db(config.rethinkdb.db).table("tags").filter({"tagName": req.query['tagName']}).update(req.body).run(
  //          connection, function(err, cursor){
  //           if (err) throw err
  //           r.db(config.rethinkdb.db).table("tagHistory").filter({"tagName": req.query['tagName']}).update(req.body).run(
  //             connection, function(err, cursor){
  //             if (err) throw err
  //             }).then(function(result) {
  //               res.json({
  //                 result: result
  //               })
  //           })
  //         })
  // }

}

function handleDeleteTagRequest (req, res) {
  //Pass in only tagName to body to delete that tag name from db (only removed from history)
  //Pass in only postId to body to delete all tags from that post in db
  //Pass in both tagName and postId to body to delete tag from given post in db

  console.log('handleDeleteTagRequest called with ' + JSON.stringify(req.route))
    r.db(config.rethinkdb.db).table('tagHistory').filter(req.body).delete().run(
         connection, function(err, cursor){
          if (err) {throw err
            console.log("Error message: "+ err.message())}
        }).then(function(result) {
           res.json({
               result: result
           })
       })

}


module.exports = TagHandler
