var Post = require('../models/Post')
var FB = require('fb')
var config = require('../config.js')
var r = require('rethinkdb')
var util = require('util')
var email = require('../email')
var auth = require('../auth.js')
var http = require('http')
var Account = require('../models/Account.js')
var handlerUtil = require('./handlerUtil.js')

var PostHandler = function () {
  this.createPost = handleCreatePostRequest
  this.getPost    = handleGetPostRequest
  this.updatePost = handleUpdatePostRequest
  this.deletePost = handleDeletePostRequest
  this.getFeed    = handleGetFeedRequest
}

var connection = null;
r.connect( {host: config.rethinkdb.host, port: config.rethinkdb.port}, function(err, conn) {
  if (err) throw err;
  connection = conn
})


// called when a user is creating a new post
// use request body to populate Post model, insert into DB using thinky
function handleCreatePostRequest (req, res) {
  if (!auth.assertHasUser(req)) return

    // create Post object
  var post = new Post({
    userId: parseInt(req.headers.userid),
    title: req.body.title,
    ingredients: req.body.ingredients,
    directions: req.body.directions,
    recipeLink: req.body.recipeLink,
    images: req.body.images,
    notes: req.body.notes,
    rating: req.body.rating,
    prepTime: req.body.prepTime,
    difficulty: req.body.difficulty
  })

    // try to store in DB
    post.save().then(function (result) {
      res.status(200).send(JSON.stringify(result))

      Account.filter({"userId":parseInt(req.headers.userid)}).run().then(function(user){
        email.sendToFriends(req.headers.userid,
                            user[0].name + " posted a new post!",
                            "Your friend " + user[0].name + " posted a new post " + result.title + "!", result)
      }).error(function(err){
        console.log(err)
        throw(err)
      })
      // send notifications to friends
      //    r.db(config.rethinkdb.db).table('users').get(req.headers.userid).getField('name').run(connection, function (err, result){
      //      email.sendToFriends(
      //        req.headers.userid,
      //        result + " posted a new recipe!",
      //        "Your friend " + result + " posted a new Post!",
      //        result)
      //    })
    }).error(function (error) {
      console.log(error.message)
      res.status(500).send({error: error.message})
    })
}

function handleGetPostRequest (req, res) {
  // Check if there is a query string passed in, slightly primitive implementation right now
  var queried = false
  var query_obj = {}
  console.log("Req.query: "+ JSON.stringify(req.query))
  for (var q in req.query) {
    if (req.query.hasOwnProperty(q)) {
      queried = true
      to_query_db = req.query[q]
      if(!isNaN(to_query_db))
        to_query_db = parseInt(to_query_db)

      query_obj[q] = to_query_db
    }
  }
  r.db(config.rethinkdb.db).table('posts').filter(query_obj).run(connection, function (err, cursor) {
    if (err) throw err
    handlerUtil.sendCursor(res, cursor)
  })

 // @panthap2 please confirm that this should be removed, I commented
 // just in case but it was crashing the srver
 // if(!queried){
 //   r.db(config.rethinkdb.db).table('posts').run(connection, function(err, cursor) {
 //     if (err) throw err;
 //     cursor.toArray(function(err, result) {
 //       if (err) throw err;
 //       res.send(200,JSON.stringify(result, null, 2))
 //     })
 //   })
 // }
}

function handleUpdatePostRequest (req, res) {

  //Specify the postId of the post that needs to be updated in url query.
  //Specify fields that need to be updated and corresponding values in request body (ex: {field1: value1, field2: value2,...})
  if (req.body.hasOwnProperty("postId")){
    r.db(config.rethinkdb.db).table('posts').filter({"postId": req.body.postId}).update(req.body).run(
      connection, function(err, cursor){
      if (err) throw err
    }).then(function(result) {
      res.json({
        result: result
      })
    })
  }
  else{
    res.send(200,"Need to specify postId in query")
  }
}

function handleDeletePostRequest (req, res) {
  //if (!auth.assertHasUser(req)) return

  Post.get(req.body.postId).getJoin({favorites: true}).run().then(function(post){
    post.deleteAll({favorites: true}).then(function(result){
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
      res.status(200).send(JSON.stringify(result))
    })
  })
}

//  console.log('handleDeletePostRequest called with ' + JSON.stringify(req.route))
//  r.db(config.rethinkdb.db).table('posts').filter({"postId": req.body.postId}).delete().run(
//         connection, function(err, cursor){
//          if (err) throw err
//        }).then(function(result) {
//           res.json({
//               result: result
//           })
//       })
//
//  r.db(config.rethinkdb.db).table('favorites').filter({"postId": req.body.postId}).delete().run(
//         connection, function(err, cursor){
//          if (err) throw err
//        })

function handleGetFeedRequest (req, res) {
  if (!auth.assertHasUser(req)) return
  num_posts = +req.headers.numposts || 10
  offset    = +req.headers.offset   || 0
  FB.api('/' + req.headers.userid + '/friends', 'get', {
    access_token: fbAppAccessToken
  }, function (response) {
    if (!response || response.error) {
      throw response.error
    }
    friends = [+req.headers.userid]
    for (i = 0; i < response.data.length; i++) {
      friends.push(+response.data[i].id)
    }
    friends = r(friends)
    r.db(config.rethinkdb.db).table('users').get(parseInt(req.headers.userid)).getField('searchHistory').run(connection, function (err, searchHistory){
    var str = String(searchHistory.toString())
    var options = {
      port: 3000,
      path: '/api/tags/feed/?tagNames='+ str,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'userid': req.headers.userid
      }
    }
      var requ = http.request(options, function (rq) {
        rq.setEncoding('utf8');
        rq.on('data', function (chunk) {
          var suggested_posts = JSON.parse(chunk)
          var suggested_post_ids = []
          for (n = 0; n < suggested_posts.length; n++){
            var p = suggested_posts[n]
            suggested_post_ids.push(p['postId'])
          }
          console.log("Suggested post ids: "+ suggested_post_ids)
          suggested_post_ids = r (suggested_post_ids)
          r.db(config.rethinkdb.db).table('users').get(parseInt(req.headers.userid))('blocked').run(connection, function (err, blocked) {
          blocked = r(blocked || [])
          r.db(config.rethinkdb.db).table('posts').filter(function (post) {
            return friends.contains(post('userId')).and(blocked.contains(post('userId')).not()).and(suggested_post_ids.contains(post('postId')).not())
          }).orderBy(r.desc('timePosted')).skip(offset).limit(num_posts).run(connection, function (err, cursor) {
            if (err) throw err
            handlerUtil.doCursorWithUser(res, cursor, connection, function (posts) {
              var feedPosts = suggested_posts.concat(posts)
              res.status(200).send(JSON.stringify(feedPosts, null, 2))
            })
          })
        })

        })
      })
      requ.end()

    })
  })
}

module.exports = PostHandler
