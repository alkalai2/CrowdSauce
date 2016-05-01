// Well need the model of account
var Tag = require('../models/Tag')
var Post = require('../models/Post')
var Account = require('../models/Account')
var TagHistory = require('../models/TagHistory')
var config = require('../config.js')
var r = require('rethinkdb')
var auth = require('../auth.js')
var FB = require('fb')
var async = require('async')
var handlerUtil = require('./handlerUtil.js')
var thinky = require('thinky')()
var tr = thinky.r

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
r.connect({host: config.rethinkdb.host, port: config.rethinkdb.port}, function (err, conn) {
  if (err) throw err;
  connection = conn
})

// called when a POST request sent to /api/tags endpoint
// adds a tag to a post
function handleAddTagRequest(req, res) {
  r.db(config.rethinkdb.db).table('tagHistory').filter({tagName: req.body.tagName, postId: req.body.postId}).run(
    connection, function (err, cursor) {
      if (err) throw err
      cursor.toArray(function (err, result) {
        if (err) throw err
        if (result.length > 0)
          res.status(500).send({error: "Duplicate tag on post"})
        else {
          function saveTagHistory() {
            var tagHistory = new TagHistory({tagName: req.body.tagName, postId: req.body.postId})
            // use Thinky to save TagHistory data
            tagHistory.save().then(function (result) {
              res.status(200).send(JSON.stringify(result))
            }).error(function (error) {
              // something went wrong
              res.status(500).send({error: error.message})
            })
          }

          var tag = new Tag({tagName: req.body.tagName})
          // use Thinky to save Tag data
          tag.save().then(function (s) {
            saveTagHistory()
          }).error(function (error) {
            //Will show error if tag already exists in db. Will still add tag to post
            console.log(error.message)
            saveTagHistory()
          })
        }
      })
    })
}

// called when a GET request sent to /api/tags/post
// returns all TagHistory objects corresponding to a given post
function handleGetPostTagsRequest(req, res) {
  //Pass in postId to query
  Post.get(req.query["postId"]).getJoin({tags: true}).run().then(function (post) {
    res.status(200).send(JSON.stringify(post.tags, null, 2))
  }).error(function (error) {
    // something went wrong
    console.log("Error: " + error.message)
    res.status(500).send({error: error.message})
  })
}

var search_tags = []
var post_search_tags = {}

// called when a GET request is sent to /api/tags/feed
// returns all Post objects with one or more of the specified tags
// Post objects ordered based on the number of search tags the post has (in descending order) 
function handleGetTagFeedRequest(req, res) {

  //Pass in tagName in URL query
  var num_posts = +req.headers.numposts || 10
  var offset = +req.headers.offset || 0
  FB.api('/' + req.headers.userid + '/friends', 'get', {
    access_token: fbAppAccessToken
  }, function (response) {
    if (!response || response.error) {
      throw response.error
    }
    var friends = [+req.headers.userid]
    for (var i = 0; i < response.data.length; i++) {
      friends.push(+response.data[i].id)
    }

    // get tags from query, remove whitespace
    var temp_search_tags = req.query['tagNames'].split(",").map(function (s) {
      return s.trim()
    })

    // remove all empty tags, repetitions and sorting tags
    var search_tags = []
    var rating = 0
    var sort_by = null
    for (var z = 0; z < temp_search_tags.length; z++) {
      if (temp_search_tags[z] == "") continue
      var colon = temp_search_tags[z].indexOf(":")
      if (colon >= 0) {
        var key = temp_search_tags[z].slice(0, colon).trim()
        var value = temp_search_tags[z].slice(colon + 1).trim()
        switch (key) {
          case "rating":
            rating = +value
            break
          case "sort":
            sort_by = value
            break
        }
        continue
      }
      if (search_tags.indexOf(temp_search_tags[z]) >= 0) continue
      search_tags.push(temp_search_tags[z])
    }

    console.log("Search tags: " + search_tags.length)
    //Add searched tags to search history
    r.db(config.rethinkdb.db).table('users').get(parseInt(req.headers.userid)).getField('searchHistory').run(connection, function (err, curr_list) {
      if (err) throw err
      for (var m = 0; m < search_tags.length; m++) {
        //Keeping entries in the searchHistory list unique
        if (curr_list.indexOf(search_tags[m]) < 0)
          r.db(config.rethinkdb.db).table('users').get(parseInt(req.headers.userid)).update({searchHistory: r.row('searchHistory').append(search_tags[m])}).run(connection)
      }
    })

    Post.getJoin({tags: true, favorites: true}).filter(function (post) {
      var f = tr(friends).contains(post('userId')).and(post('rating').ge(rating))
      if (search_tags.length > 0) {
        f = f.and(post("tags").getField("tagName").setIntersection(tr(search_tags)).count().gt(0))
      }
      return f
    }).orderBy(tr.desc(function (post) {
      // sort by favorites, rating or number of matching tags depending on sort:whatever
      if (sort_by == "favorites") {
        return post("favorites").count()
      } else if (sort_by == "rating") {
        return post("rating")
      } else {
        return post("tags").getField("tagName").setIntersection(tr(search_tags)).count()
      }
    }), tr.desc('timePosted')).skip(offset).limit(num_posts).run().then(function (result) {
      res.status(200).send(JSON.stringify(result, null, 2))
    }).error(function (error) {
      // something went wrong
      console.log("Error: " + error.message)
      res.status(500).send({error: error.message})
    })
  })
}

// called when a GET request is sent to /api/tags
// returns all Tag objects stored in the database
function handleGetTagsRequest(req, res) {
  r.db(config.rethinkdb.db).table('tags').run(connection, function (err, cursor) {
    if (err) throw err
    handlerUtil.sendCursor(res, cursor)
  })
}

// Is not implemented because you either add a tag or remove a tag from a post - not update a tag
function handleUpdateTagsRequest(req, res) {
  console.log('handleUpdateTagsRequest called with ' + JSON.stringify(req.route))

}

// called when a DELETE request is sent to /api/tags/name
function handleDeleteTagRequest(req, res) {
  //Pass in only postId to body to delete all tags from that post in db
  //Pass in both tagName and postId to body to delete tag from given post in db

  console.log('handleDeleteTagRequest called with ' + JSON.stringify(req.route))
  r.db(config.rethinkdb.db).table('tagHistory').filter(req.body).run(connection, function (err, cursor) {
    if (err) throw err
    cursor.toArray(function (err, result) {
      if (err) throw err
      async.each(result,
        function (history, callback) {
          TagHistory.get(history.id).then(function (taghistory) {
            console.log("first" + JSON.stringify(taghistory))
            taghistory.delete().then(function (result) {
              console.log("first delete" + JSON.stringify(result))
              console.log(history.tagName)
              TagHistory.filter({tagName: history.tagName}).then(function (num) {
                console.log("num" + JSON.stringify(num))
                if (num.length === 0) {
                  Tag.get(history.tagName).then(function (tag) {
                    tag.delete().then(function (result) {
                      callback(result)
                    })
                  })
                }
                else {
                  callback(result)
                }
              })
            })
          })
        },
        function (err) {
          res.status(200).send("Done")
        }
      )
    })
  })
}

// called when a DELETE request is sent to /api/tags
// completely wipes the database of a given tag
// removes given tag from all posts that have it
// currently only used for testing
function handleDeleteTagNameRequest(req, res) {
  console.log('handleDeleteTagNameRequest called with ' + JSON.stringify(req.route))
  r.db(config.rethinkdb.db).table('tags').filter(req.body).delete().run(
    connection, function (err, cursor) {
      if (err)
        throw err
    })
  r.db(config.rethinkdb.db).table('tagHistory').filter(req.body).delete().run(
    connection, function (err, cursor) {
      if (err)
        throw err
    }).then(function (result) {
    res.json({
      result: result
    })
  })

}


module.exports = TagHandler
