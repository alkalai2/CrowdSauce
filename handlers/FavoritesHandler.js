// Well need the model of account
var Favorites = require('../models/Favorites')
var config = require('../config.js')
var r = require('rethinkdb')

var FavoritesHandler = function () {
  this.createFavorites = handleCreateFavoritesRequest
  this.getFavorites = handleGetFavoritesRequest
  this.updateFavorites = handleUpdateFavoritesRequest
  this.deleteFavorites = handleDeleteFavoritesRequest
}

var connection = null;
r.connect( {host: config.rethinkdb.host, port: config.rethinkdb.port}, function(err, conn) {
    if (err) throw err;
    connection = conn
})

// called when a user logs in, add userId to DB if not present
// create Account object, add data to DB using thinky
function handleCreateFavoritesRequest (req, res) {
  // create Account object
  var favorites = new Favorites({userId: req.body.userId, postIds: req.body.postIds})

  // use Thinky to save Favorites data
  favorites.save().then(function (result) {
    res.send(200, JSON.stringify(result))
  }).error(function (error) {
    // something went wrong
    res.send(500, {error: error.message})
  })
}

function handleGetFavoritesRequest (req, res) {
  // Check if there is a query string passed in, slightly primitive implementation right now
  var queried = false
  for (var q in req.query) {
    if (req.query.hasOwnProperty(q)) {
      queried = true
      r.db(config.rethinkdb.db).table('favorites').filter(r.row(q).eq(req.query[q])).run(
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

function handleUpdateFavoritesRequest (req, res) {
  console.log('handleUpdateAccountRequest called with ' + JSON.stringify(req.route))
}
function handleDeleteFavoritesRequest (req, res) {
  console.log('handleDeleteAccountRequest called with ' + JSON.stringify(req.route))
  
}


module.exports = FavoritesHandler
