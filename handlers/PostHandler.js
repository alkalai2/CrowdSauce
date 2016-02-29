var Post = require('../models/Post')
var FB = require('fb')
var config = require('../config.js')
var r = require('rethinkdb')

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

  // create Post object
  var post = new Post(
    {
      userId: req.query.userId,
      ingredients: req.body.ingredients,
      directions: req.body.directions,
      recipeLink: req.body.recipeLink,
      imageLinks: req.body.imageLinks,
      tags: req.body.tags,
      notes: req.body.notes,
      rating: req.body.rating
    })

  // try to store in DB
  post.save().then(function (result) {
    res.status(200).send(JSON.stringify(result))
  // res.send(200, JSON.stringify(result))
  }).error(function (error) {
    console.log(error.message)
    res.status(500).send({error: error.message})
  // res.send(500, {error:error.message})
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
  console.log('handleUpdatePostRequest called with ' + JSON.stringify(req.route))
}

function handleDeletePostRequest (req, res) {
  console.log('handleDeletePostRequest called with ' + JSON.stringify(req.route))
}

function handleGetFeedRequest (req, res) {
  num_posts = req.body.num_posts
  FB.api('/' + req.query.userId + '/friends', 'get', {
    access_token: fbAppAccessToken
  }, function (response) {
    if (!response || response.error) {
      throw response.error
    }
    friends = []
    for (i = 0; i < response.data.length; i++) {
      friends.push(response.data[i].id)
    }
    r.db(config.rethinkdb.db).table('posts').filter(function(post) {
      return r.expr(friends).contains(post('userId'))
    }).orderBy(r.desc('timePosted')).limit(10).run(connection, function (err, cursor) {
      if (err) throw err
      cursor.toArray(function(err, result) {
        if (err) throw err;
        res.status(200).send(JSON.stringify(result, null, 2))
      })
    })
  })
}

module.exports = PostHandler
