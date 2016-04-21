// Well need the model of account
var Account = require('../models/Account')
var Post = require('../models/Post')
var async = require('async')
var FB = require('fb')
var config = require('../config.js')
var r = require('rethinkdb')
var auth = require('../auth.js')
var http = require('http')

var AccountHandler = function () {
  this.createAccount = handleCreateAccountRequest
  this.getAccount = handleGetAccountRequest
  this.updateAccount = handleUpdateAccountRequest
  this.deleteAccount = handleDeleteAccountRequest
  this.blockAccount = handleAddBlockRequest
  this.unblockAccount = handleRemoveBlockRequest
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

    FB.api('/' + req.headers.userid + '?fields=name,email,picture', 'get', {
      access_token: fbAppAccessToken
    }, function (response) {
      if (!response.email) {
        console.log("User either has no email or no email permissions: " + response.name)
      }
      var account = new Account({
        userId: req.headers.userid,
        name: response.name,
        email: response.email || "",
        picture: response.picture.data.url
      })
      // use Thinky to save Account data
      account.save().then(function (result) {
        res.status(200).send(JSON.stringify(result))
      }).error(function (error) {
        // something went wrong
        res.status(500).send({error: error.message})
      })
    })
}

function handleGetAccountRequest (req, res) {
  // Check if there is a query string passed in, slightly primitive implementation right now
  var queried = false
  for (var q in req.query) {
    console.log(q)
    if (req.query.hasOwnProperty(q)) {
      queried = true
      to_query_db = req.query[q]
      if(!isNaN(to_query_db))
        to_query_db = parseInt(to_query_db)
      console.log({[q]: to_query_db})
      console.log("query is " + q)
      Account.filter({[q]: to_query_db}).run().then(function(user){
        res.status(200).send(JSON.stringify(user, null, 2))
      }).error(function(err){
        res.status(500).send({error: err.message})
      })
    }
  }
  if(!queried){
    Account.run().then(function(users){
      console.log(users)
      res.status(200).send(JSON.stringify(users, null, 2))
    })
  }
}

function handleUpdateAccountRequest (req, res) {
  console.log('handleUpdateAccountRequest called with ' + JSON.stringify(req.route))
  if(req.body.notification === "true") {
    req.body.notification = true;
  }
  else if (req.body.notification === "false") {
    req.body.notification = false;
  }
  r.db(config.rethinkdb.db).table('users').filter({"userId": parseInt(req.headers.userid)}).update(req.body).run(
    connection, function(err, cursor) {
    if (err) throw err
  }).then(function(result) {
    res.json({result: result})
  })
}

function handleAddBlockRequest(req, res) {
  if (!auth.assertHasUser(req)) return
    user = r.db(config.rethinkdb.db).table('users').get(parseInt(req.headers.userid))
  user('blocked').append(req.body.userid).run(connection, function(err, result) {
    if (err) throw err
      user.update({blocked: result}).run(connection, function(err, r) {
        if (err) throw err
          res.status(200).send(JSON.stringify(result))
      })
  })
}
function handleRemoveBlockRequest(req, res) {
  if (!auth.assertHasUser(req)) return
    user = r.db(config.rethinkdb.db).table('users').get(parseInt(req.headers.userid))
  user('blocked').run(connection, function(err, cursor) {
    if (err) throw err
      cursor.toArray(function(err, result) {
        if (err) throw err
          for (i = 0; i < result.length; i++) {
            if (result[i] == req.body.userid) {
              user('blocked').deleteAt(i).run(connection, function(err, result) {
                user.update({blocked: result}).run(connection, function(err, r) {
                  if (err) throw err
                    res.status(200).send(JSON.stringify(result))
                })
              })
              break
            }
          }
      })
  })
}

function handleDeleteAccountRequest (req, res) {
  if (!auth.assertHasUser(req)) return

    console.log(req.headers.userid)
    Account.get(parseInt(req.headers.userid)).getJoin({posts: true, favorites: true}).run().then(function(user){
      console.log(user)
      var postIds = user.posts.map(function(a) {return a.postId})
      if (postIds.length != 0){
        Post.getAll.apply(Post, postIds).getJoin({favorites: true}).run().then(function(posts){
          async.each(posts,
                     function(post, callback){
                       post.deleteAll({favorites:true}).then(function(result){
                         console.log(post)
                         var data = JSON.stringify({postId: post.postId})
                         var options = {
                           port: 3000,
                           path: '/api/tags',
                           method: 'DELETE',
                           headers: {
                             'Content-Type': 'application/json',
                             'Content-Length': data.length
                           }
                         }
                         var requ = http.request(options, function (res) {
                           res.setEncoding('utf8');
                           res.on('data', function (chunk) {
                             console.log('Response: ' + chunk);
                           })
                         })
                         requ.write(data)
                         requ.end()
                         callback(result)
                       })
                     },
                     function(err){
                       user.deleteAll({posts: true, favorites: true}).then(function(result){
                         res.status(200).send(JSON.stringify(result, null, 2))
                       })
                     }
                    )
        })
      }
      else{
        user.deleteAll({posts: true, favorites: true}).then(function(result){
          res.status(200).send(JSON.stringify(result, null, 2))
        })
      }
    })
}

module.exports = AccountHandler
