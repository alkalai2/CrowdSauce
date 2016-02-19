// var Account = require('../models/Account')

var PostHandler = function () {
  this.createPost = handleCreatePostRequest
  this.getPost = handleGetPostRequest
  this.updatePost = handleUpdatePostRequest
  this.deletePost = handleDeletePostRequest
}

function handleCreatePostRequest (req, res) {
  console.log('handleCreatePostRequest called with' + req.body)
}

function handleGetPostRequest (req, res) {
  console.log('handleGetPostRequest called with' + req.body)
}

function handleUpdatePostRequest (req, res) {
  console.log('handleUpdatePostRequest called with' + req.body)
}

function handleDeletePostRequest (req, res) {
  console.log('handleDeletePostRequest called with' + req.body)
}

module.exports = PostHandler
