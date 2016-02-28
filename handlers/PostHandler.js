var Post = require('../models/Post')
var FB = require('fb')
var config = require('../config.js')
var r = require('rethinkdb')

var PostHandler = function () {
  this.createPost = handleCreatePostRequest
  this.getPost = handleGetPostRequest
  this.updatePost = handleUpdatePostRequest
  this.deletePost = handleDeletePostRequest
}

var connection = null;
r.connect( {host: config.rethinkdb.host, port: config.rethinkdb.port}, function(err, conn) {
    if (err) throw err;
    connection = conn
})

// called when a user is creating a new post
// use request body to populate Post model, insert into DB using thinky
function handleCreatePostRequest (req, res) {
  if (!fbAppAccessToken) {
    console.error('Could not create post because there is no facebook app access token.')
    return
  }
  var invalid_access = false
  FB.api('/debug_token?', 'get', {
    input_token: req.body.accessToken,
    access_token: fbAppAccessToken
  }, function (response) {
    if (!response.data.is_valid) {
      console.log('Invalid access attempted')
      invalid_access = true
    }
  })
  if (invalid_access) return

  // create Post object
  var post = new Post(
    {
      userId: req.body.userId,
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
  r.db(config.rethinkdb.db).table('posts').run(connection, function(err, cursor) {
      if (err) throw err;
      cursor.toArray(function(err, result) {
          if (err) throw err;
          res.send(200,JSON.stringify(result, null, 2))
      })
  })
}

function handleUpdatePostRequest (req, res) {
  console.log('handleUpdatePostRequest called with ' + JSON.stringify(req.route))
}

function handleDeletePostRequest (req, res) {
  console.log('handleDeletePostRequest called with ' + JSON.stringify(req.route))
}

module.exports = PostHandler
