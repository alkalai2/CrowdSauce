var Post = require('../models/Post')
var FB = require('fb')
var config = require('../config.js')
var r = require('rethinkdb')
var util = require('util')
var email = require('../email')
var auth = require('../auth.js')

var PostHandler = function () {
  this.createPost = handleCreatePostRequest
  this.getPost    = handleGetPostRequest
  this.updatePost = handleUpdatePostRequest
  this.deletePost = handleDeletePostRequest
  this.getFeed    = handleGetFeedRequest
}

var connection = null;
r.connect( {host: config.rethinkdb.host, port: config.rethinkdb.port}, function(err, conn) {
    if (err) throw err;
    connection = conn
})

// called when a user is creating a new post
// use request body to populate Post model, insert into DB using thinky
function handleCreatePostRequest (req, res) {
  if (!auth.assertHasUser(req)) return

  // create Post object
  var post = new Post(
    {
      userId: req.headers.userid,
      ingredients: req.body.ingredients,
      directions: req.body.directions,
      recipeLink: req.body.recipeLink,
      imageLink: req.body.imageLink,
      tags: req.body.tags,
      notes: req.body.notes,
      rating: req.body.rating
    })

  // try to store in DB
  post.save().then(function (result) {
    res.status(200).send(JSON.stringify(result))
    FB.api('/' + req.headers.userid + '?fields=name', 'get', {
      access_token: fbAppAccessToken
    }, function (response) {
      email.sendToFriends(
        req.headers.userid,
        response.name + " posted a new recipe!",
        "<img src='" + req.body.imageLink + "'>")
    })
  }).error(function (error) {
    console.log(error.message)
    res.status(500).send({error: error.message})
  })
}

function handleGetPostRequest (req, res) {
  // Check if there is a query string passed in, slightly primitive implementation right now
  var queried = false
  for (var q in req.query) {
    if (req.query.hasOwnProperty(q)) {
      queried = true
      r.db(config.rethinkdb.db).table('posts').filter(r.row(q).eq(req.query[q])).run(
          connection, function (err, cursor) {
            if (err) throw err
            cursor.toArray(function (err, result) {
              if (err) throw err
              res.send(200, JSON.stringify(result, null, 2))
          })
      })
    }
  }
  if(!queried){
    r.db(config.rethinkdb.db).table('posts').run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
          if (err) throw err;
          res.send(200,JSON.stringify(result, null, 2))
        })
    })
  }
}

function handleUpdatePostRequest (req, res) {

  //Specify the postId of the post that needs to be updated in url query.
  //Specify fields that need to be updated and corresponding values in request body (ex: {field1: value1, field2: value2,...})
  console.log('handleUpdatePostRequest called with ' + JSON.stringify(req.route))
  if (req.query.hasOwnProperty("postId")){
    r.db(config.rethinkdb.db).table('posts').filter({"postId": req.query.postId}).update(req.body).run(
           connection, function(err, cursor){
            if (err) throw err
          }).then(function(result) {
             res.json({
                 result: result
             })
         })
  }
  else{
    res.send(200,"Need to specify postId in query")
  }
}

function handleDeletePostRequest (req, res) {
  console.log('handleDeletePostRequest called with ' + JSON.stringify(req.route))
  r.db(config.rethinkdb.db).table('posts').filter({"postId": req.query['postId']}).delete().run(
         connection, function(err, cursor){
          if (err) throw err
        }).then(function(result) {
           res.json({
               result: result
           })
       })

  r.db(config.rethinkdb.db).table('favorites').filter({"postId": req.query['postId']}).delete().run(
         connection, function(err, cursor){
          if (err) throw err
        })
}

function handleGetFeedRequest (req, res) {
  if (!auth.assertHasUser(req)) return
  num_posts = +req.headers.numposts || 10
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
    r.db(config.rethinkdb.db).table('posts').filter(function(post) {
      return friends.contains(post('userId'))
    }).orderBy(r.desc('timePosted')).limit(num_posts).run(connection, function (err, cursor) {
      if (err) throw err
      cursor.toArray(function(err, result) {
        if (err) throw err;
        res.status(200).send(JSON.stringify(result, null, 2))
      })
    })
  })
}

module.exports = PostHandler
