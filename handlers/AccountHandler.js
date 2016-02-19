// Well need the model of account
// var Account = require('../models/Account')

var AccountHandler = function () {
  this.createAccount = handleCreateAccountRequest
  this.getAccount = handleGetAccountRequest
  this.updateAccount = handleUpdateAccountRequest
  this.deleteAccount = handleDeleteAccountRequest
}

function handleCreateAccountRequest (req, res) {
  console.log('handleCreateAccountRequest called with' + req.body)
}

function handleGetAccountRequest (req, res) {
  console.log('handleGetAccountRequest called with' + req.body)
}

function handleUpdateAccountRequest (req, res) {
  console.log('handleUpdateAccountRequest called with' + req.body)
}

function handleDeleteAccountRequest (req, res) {
  console.log('handleDeleteAccountRequest called with' + req.body)
}

module.exports = AccountHandler
