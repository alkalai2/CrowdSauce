// Well need the model of account
var Account = require('../models/Account')
var config = require('../config.js')
var r = require('rethinkdb')
var auth = require('../auth.js')

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
  if (!auth.assertHasUser(req)) return

  // create Account object
  var account = new Account({userId: req.headers.userid})

  // use Thinky to save Account data
  account.save().then(function (result) {
    res.send(200, JSON.stringify(result))
  }).error(function (error) {
    // something went wrong
    res.send(500, {error: error.message})
  })
}

function handleGetAccountRequest (req, res) {
  // Check if there is a query string passed in, slightly primitive implementation right now
  var queried = false
  for (var q in req.query) {
    if (req.query.hasOwnProperty(q)) {
      queried = true
      r.db(config.rethinkdb.db).table('users').filter(r.row(q).eq(parseInt(req.query[q]))).run(
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
    r.db(config.rethinkdb.db).table('users').run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
          if (err) throw err;
          res.send(200,JSON.stringify(result, null, 2))
        })
    })
  }
}


function handleUpdateAccountRequest (req, res) {
  //Meaningless while userId is the only field because userId cannot be updated
  console.log('handleUpdateAccountRequest called with ' + JSON.stringify(req.route))
}
function handleDeleteAccountRequest (req, res) {
  if (!auth.assertHasUser(req)) return

  r.db(config.rethinkdb.db).table('users').filter(req.headers.userid).delete().run(
    connection, function(err, cursor) {
      if (err) throw err
    }
  ).then(function(result) {
    res.json({
      result: result
    })
  })

  r.db(config.rethinkdb.db).table('favorites').filter({"userId": req.headers.userid}).delete().run(
    connection, function(err, cursor) {
      if (err) throw err
    }
  )
}

module.exports = AccountHandler
