// Well need the model of account
var Account = require('../models/Account')
var config = require('../config.js')
var r = require('rethinkdb')

var AccountHandler = function () {
  this.createAccount = handleCreateAccountRequest
  this.getAccount = handleGetAccountRequest
  this.updateAccount = handleUpdateAccountRequest
  this.deleteAccount = handleDeleteAccountRequest
}

var connection = null;
r.connect( {host: config.rethinkdb.host, port: config.rethinkdb.port}, function(err, conn) {
    if (err) throw err;
    connection = conn
})

// called when a user logs in, add userId to DB if not present
// create Account object, add data to DB using thinky
function handleCreateAccountRequest (req, res) {
  console.log('handleCreateAccountRequest called with ' + JSON.stringify(req.route))

  // create Account object
  var account = new Account({userId: req.body.userId})

  // use Thinky to save Account data
  account.save().then(function (result) {
    res.send(200, JSON.stringify(result))
  }).error(function (error) {
    // something went wrong
    res.send(500, {error: error.message})
  })
}

function handleGetAccountRequest (req, res) {
  console.log('handleGetAccountRequest called on ' + req.originalUrl)
  console.log('handleGetAccountRequest called with ' + JSON.stringify(req.route))


  r.db(config.rethinkdb.db).table('users').run(connection, function(err, cursor) {
      if (err) throw err;
      cursor.toArray(function(err, result) {
          if (err) throw err;
          res.send(200,JSON.stringify(result, null, 2))
      })
  })
}

function handleUpdateAccountRequest (req, res) {
  console.log('handleUpdateAccountRequest called with ' + JSON.stringify(req.route))
}

function handleDeleteAccountRequest (req, res) {
  console.log('handleDeleteAccountRequest called with ' + JSON.stringify(req.route))
}

module.exports = AccountHandler
