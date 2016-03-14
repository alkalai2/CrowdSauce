// Well need the model of account
var Favorites = require('../models/Favorites')
var Account = require('../models/Account')
var Post = require('../models/Post')
var config = require('../config.js')
var r = require('rethinkdb')
var auth = require('../auth.js')
var email = require('../email.js')
var util = require('util')

var FavoritesHandler = function () {
  this.createFavorites = handleCreateFavoritesRequest
  this.getUserFavorites = handleGetUserFavoritesRequest
  this.getPostFavorites = handleGetPostFavoritesRequest
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
  if (!auth.assertHasUser(req)) return

  r.db(config.rethinkdb.db).table('favorites').filter({userId: parseInt(req.headers.userid), postId: req.body.postId}).run(
    connection, function (err, cursor) {

      if (err) throw err
            cursor.toArray(function (err, result) {
              if (err) throw err
              if (result.length > 0)
                res.send(500, {error: "Duplicate favorite on post"})
              else{
                    // create Favorites object
                    var favorites = new Favorites({userId: parseInt(req.headers.userid), postId: req.body.postId})

                    console.log("PostId: "+ req.body.postId)
                    // use Thinky to save Favorites data
                    favorites.save().then(function (result) {
                      console.log("Favorites Result: "+ JSON.stringify(result))
                      res.send(200, JSON.stringify(result))
                      r.db(config.rethinkdb.db).table('posts').get(req.body.postId).run(
                        connection, function (err, res) {
                          if (err){
                            console.log("Error favorites: "+ err.message)
                            throw err

                            } 
                          console.log("RESULT "+ JSON.stringify(res))
                          email.sendToUser(res.userId, "Someone favorited your post", "YOU ARE POPULAR")
                        }
                      )
                    }).error(function (error) {
                      // something went wrong
                      res.send(500, {error: error.message})
                    })


              }

          })
    })

}

function handleGetUserFavoritesRequest(req,res) {
  if (!auth.assertHasUser(req)) return

  //Pass in userId in URL query
  Account.get(parseInt(req.headers.userid)).getJoin({favorites: true}).run().then(function(account) {
    console.log("Result: "+ JSON.stringify(account))
    res.send(200, JSON.stringify(account.favorites, null, 2))
  }).error(function (error) {
    // something went wrong
    console.log("Error: "+ error.message)
    res.send(500, {error: error.message})
  })
}

function handleGetPostFavoritesRequest(req,res) {
  //Pass in postId in URL query
  Post.get(req.query["postId"]).getJoin({favorites: true}).run().then(function(post) {
      res.send(200, JSON.stringify(post.favorites, null, 2))
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
  if (req.query.hasOwnProperty("userId")){  r.db(config.rethinkdb.db).table("favorites").filter({"userId": req.headers.userid}).update(req.body).run(
           connection, function(err, cursor){
            if (err) throw err
          }).then(function(result) {
             res.json({
                 result: result
             })
         })
     }

}
function handleDeleteFavoritesRequest (req, res) {
  queryObj = false
  userId = req.body.userId
  postId = req.body.postId
  
  if (userId && postId)
    queryObj = {"userId": parseInt(userId), "postId": postId}
  else if (userId)
    queryObj = {"userId": parseInt(userId)}
  else if (postId)
    queryObj = {"postId": postId}

  console.log('handleDeleteAccountRequest called with ' + JSON.stringify(req.route))
    r.db(config.rethinkdb.db).table('favorites').filter(queryObj).delete().run(
         connection, function(err, cursor){
          if (err) {throw err
            console.log("Error message: "+ err.message())}
        }).then(function(result) {
           res.json({
               result: result
           })
       })
  
}


module.exports = FavoritesHandler
