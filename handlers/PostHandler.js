var Post = require('../models/Post')

var PostHandler = function () {
  this.createPost = handleCreatePostRequest
  this.getPost = handleGetPostRequest
  this.updatePost = handleUpdatePostRequest
  this.deletePost = handleDeletePostRequest
}

function handleCreatePostRequest (req, res) {
  console.log('handleCreatePostRequest called with ' + JSON.stringify(req.route))
  console.log("Request body: " + req.body)
  var userId = req.params.userId
  var post = new Post(
  	{userId: userId,
  	 ingredients: req.body.ingredients,
  	 directions: req.body.directions ,
     recipeLink: req.body.recipeLink,
     imageLinks: req.body.imageLinks,
     tags: req.body.tags,
     notes: req.body.notes,
     rating: req.body.rating
  })

  post.save().then(function(result) {
        res.send(200, JSON.stringify(result))
    }).error(function(error){
    	res.send(500, {error:error.message})
    })

}

function handleGetPostRequest (req, res) {
  console.log('handleGetPostRequest called with ' + req.originalUrl)
  console.log('handleGetPostRequest called with ' + JSON.stringify(req.route))
}

function handleUpdatePostRequest (req, res) {
  console.log('handleUpdatePostRequest called with ' + JSON.stringify(req.route))
}

function handleDeletePostRequest (req, res) {
  console.log('handleDeletePostRequest called with ' + JSON.stringify(req.route))
}

module.exports = PostHandler
