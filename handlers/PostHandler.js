var Post = require('../models/Post')

var PostHandler = function () {
  this.createPost = handleCreatePostRequest
  this.getPost = handleGetPostRequest
  this.updatePost = handleUpdatePostRequest
  this.deletePost = handleDeletePostRequest
}

// called when a user is creating a new post
// use request body to populate Post model, insert into DB using thinky
function handleCreatePostRequest (req, res) {
  console.log(' handleCreatePostRequest called with ' + JSON.stringify(req.route))
  console.log(' handleCreatePostRequest request body : ' + JSON.stringify(req.body))

  // create Post object
  var post = new Post(
  	{
      userId: req.params.userId,
      ingredients: req.body.ingredients,
      directions: req.body.directions ,
      recipeLink: req.body.recipeLink,
      imageLinks: req.body.imageLinks,
      tags: req.body.tags,
      notes: req.body.notes,
      rating: req.body.rating
    })

  // try to store in DB
  post.save().then(function(result) {
      res.status(200).send(JSON.stringify(result))
      //res.send(200, JSON.stringify(result))
  }).error(function(error){
    console.log(error.message)
    res.status(500).send({error:error.message})
    // res.send(500, {error:error.message})
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
