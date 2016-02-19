// var Account = require('../models/Account')

var PostHandler = function () {
  this.createPost = handleCreatePostRequest
  this.getPost = handleGetPostRequest
  this.updatePost = handleUpdatePostRequest
  this.deletePost = handleDeletePostRequest
}

function handleCreatePostRequest (req, res) {
  console.log('handleCreatePostRequest called with ' + JSON.stringify(req.route))
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
