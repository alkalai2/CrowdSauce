// Well need the model of account
var Tag = require('../models/Tag')
var Post = require('../models/Post')
var TagHistory = require('../models/TagHistory')
var config = require('../config.js')
var r = require('rethinkdb')
var auth = require('../auth.js')
var FB = require('fb')

var TagHandler = function () {
  this.addTag = handleAddTagRequest
  this.getPostTags = handleGetPostTagsRequest
  this.getTagFeed = handleGetTagFeedRequest
  this.getTags = handleGetTagsRequest
  this.updateTag = handleUpdateTagsRequest
  this.deleteTag = handleDeleteTagRequest
  this.deleteTagName = handleDeleteTagNameRequest
}

var connection = null;
r.connect( {host: config.rethinkdb.host, port: config.rethinkdb.port}, function(err, conn) {
    if (err) throw err;
    connection = conn
})

function handleAddTagRequest (req, res) {
  r.db(config.rethinkdb.db).table('tagHistory').filter({tagName: req.body.tagName, postId: req.body.postId}).run(
          connection, function (err, cursor) {
            if (err) throw err
            cursor.toArray(function (err, result) {
              if (err) throw err
              if (result.length > 0)
                res.send(500, {error: "Duplicate tag on post"})
              else{
                    var tag = new Tag({tagName: req.body.tagName})
                    // use Thinky to save Tag data
                    tag.save()
                    var tagHistory = new TagHistory({tagName: req.body.tagName, postId: req.body.postId})
                    // use Thinky to save TagHistory data
                    tagHistory.save().then(function (result) {
                      res.send(200, JSON.stringify(result))
                    }).error(function (error) {
                      // something went wrong
                      res.send(500, {error: error.message})
                    })
              }
          })
    })
}

function handleGetPostTagsRequest(req,res) {
  //Pass in postId to query
  Post.get(req.query["postId"]).getJoin({tags: true}).run().then(function(post) {
    console.log("Result: "+ JSON.stringify(post.tags))
    res.send(200, JSON.stringify(post.tags, null, 2))
  }).error(function (error) {
    // something went wrong
    console.log("Error: "+ error.message)
    res.send(500, {error: error.message})
  })
}

var search_tags = []
var post_search_tags = {}
function handleGetTagFeedRequest(req,res) {

  //Pass in tagName in URL query
  num_posts = +req.headers.numposts || 10
  offset    = +req.headers.offset   || 0
  FB.api('/' + req.headers.userid + '/friends', 'get', {
    access_token: fbAppAccessToken
  }, function (response) {
    if (!response || response.error) {
      throw response.error
    }
    friends = []
    for (i = 0; i < response.data.length; i++) {
      friends.push(+response.data[i].id)
    }
    friends = r(friends)

    search_tags = req.query['tagNames'].split(",")
    //Keep track of all the search tags that a post has
    post_search_tags = {}
    Post.getJoin({tags: true}).run().then(function(posts) {
      var postIds = []
      for (i = 0; i < posts.length; i++){
        var post_tags = posts[i].tags
        var post_tag_names = []
        for (j = 0; j < post_tags.length; j++){
          var tagName = post_tags[j]['tagName']
          if (search_tags.indexOf(tagName) >= 0){
            if (!(posts[i].postId in post_search_tags)){
              post_search_tags[posts[i].postId] = []
              postIds.push(posts[i].postId)
            }
            if (post_search_tags[posts[i].postId].indexOf(tagName) < 0)
              post_search_tags[posts[i].postId].push(tagName)
          }
        }

      }

      var posts = r(postIds)
      console.log("posts: " + posts)
      r.db(config.rethinkdb.db).table('posts').filter(function(post) {
        return friends.contains(post('userId')).and(posts.contains(post('postId')))
      }).orderBy(r.desc('timePosted')).skip(offset).limit(num_posts).run(connection, function (err, cursor) {
      if (err) throw err
        cursor.toArray(function(err, result) {
          if (err) throw err;
          var unordered_posts = result
          var unordered_postIds = []
          for (j = 0; j < unordered_posts.length; j++){ 
            unordered_postIds.push(unordered_posts[j]["postId"])
          }

          //Order the posts based on relevance (number of matching search tags)
          var keep_post_search_tags_list = []
          for (var postId in post_search_tags){
            if (post_search_tags.hasOwnProperty(postId)){
              if (unordered_postIds.indexOf(postId) >= 0)
                keep_post_search_tags_list.push({"postId": postId, "matchingTags": post_search_tags[postId].length})
            }
          }

          keep_post_search_tags_list.sort(function(a, b) { return a.matchingTags - b.matchingTags; }).reverse()
          var ordered_posts = [] 
          for(m = 0; m < unordered_posts.length; m++){
              for (n = 0; n < keep_post_search_tags_list.length; n++){
                if (unordered_posts[m]["postId"] == keep_post_search_tags_list[n]["postId"]){
                  ordered_posts[n] = unordered_posts[m]
                  break
                }
              }
          }

          res.status(200).send(JSON.stringify(ordered_posts, null, 2))

        })
      }).error(function (error) {
      // something went wrong
      console.log("Error: "+ error.message)
      res.send(500, {error: error.message})
    })

    })



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

}

function handleDeleteTagRequest (req, res) {
  //Pass in only postId to body to delete all tags from that post in db
  //Pass in both tagName and postId to body to delete tag from given post in db

  console.log('handleDeleteTagRequest called with ' + JSON.stringify(req.route))
    r.db(config.rethinkdb.db).table('tagHistory').filter(req.body).delete().run(
         connection, function(err, cursor){
          if (err) throw err
        }).then(function(result) {
           res.json({
               result: result
           })
       })

}

function handleDeleteTagNameRequest(req,res){
    console.log('handleDeleteTagNameRequest called with ' + JSON.stringify(req.route))
    r.db(config.rethinkdb.db).table('tags').filter(req.body).delete().run(
         connection, function(err, cursor){
          if (err)
            throw err
  })
    r.db(config.rethinkdb.db).table('tagHistory').filter(req.body).delete().run(
          connection, function(err, cursor){
            if (err)
              throw err
          }).then(function(result) {
            res.json({
               result: result
           })
       })

}


module.exports = TagHandler
