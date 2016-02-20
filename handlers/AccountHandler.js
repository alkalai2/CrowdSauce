// Well need the model of account
var Account = require('../models/Account')

var AccountHandler = function () {
  this.createAccount = handleCreateAccountRequest
  this.getAccount = handleGetAccountRequest
  this.updateAccount = handleUpdateAccountRequest
  this.deleteAccount = handleDeleteAccountRequest
}

function handleCreateAccountRequest (req, res) {
  console.log('handleCreateAccountRequest called with ' + JSON.stringify(req.route))
  var userId = req.params.userId
  var account = new Account({userId: userId})
  account.save().then(function(result) {
        res.send(200, JSON.stringify(result))
    }).error(function(error){
    	res.send(500, {error:error.message})
    })

// TODO: We should just pass req into AccountModel Constructor
// Then use that to just then say rethinkdb.users.add(account.username)
}

function handleGetAccountRequest (req, res) {
  console.log('handleGetAccountRequest called on ' + req.originalUrl)
  console.log('handleGetAccountRequest called with ' + JSON.stringify(req.route))
}

function handleUpdateAccountRequest (req, res) {
  console.log('handleUpdateAccountRequest called with ' + JSON.stringify(req.route))
}

function handleDeleteAccountRequest (req, res) {
  console.log('handleDeleteAccountRequest called with ' + JSON.stringify(req.route))
}

module.exports = AccountHandler
