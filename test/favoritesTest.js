var assert = require('assert')
    request = require('request')
    app = require('../app')
    testUserId = '112186842507184'
    testAccessToken = 'CAAIAH9y5RLgBAKtjhOYDJwpJNcglmjXExqn7MtnaE4vZAHH3Q80AyoEOp71aKZBdxRPGjALstG2vRDhnZAvtXJIpyU4CafM0heYflHIFNK6ZBEt3wJdMZBNKNJMRAKuVSvPZCCh9pkwUjCtwKF5p3jHFDAnHYJXkYJUYG7ThjXm33SCql0lMTUZCy3kgMC6zgEWJLZBlEUt5HwZDZD';

describe('Favorite Endpoint Tests', function() {
  
  process.env.CRS_DEBUG = 1

  it('post, get, update, delete requests', function (done) {
    var accountOptions = {
      url: "http://localhost:3000/api/accounts/",
      headers: {
      'userid' : testUserId,
      'accesstoken' : testAccessToken
    }
  }
      request.post(accountOptions, function (err, res, body) {
        var postId = 0
        var postBody = {
            "ingredients": ["salt", "pepper"],
            "directions": ["boil water", "cook"],
            "recipeLink": "google.com"
          }

        var postOptions = {
          url: "http://localhost:3000/api/posts/",
          headers: {
          'userid' : testUserId,
          'accesstoken' : testAccessToken,
          'Content-Type' : "application/json"
          },

          body: JSON.stringify(postBody)
        }
          request.post(postOptions, function (err, res, body) {
            var result = JSON.parse(res.body)
            postId = result.postId
            var favPostBody = {"postId": postId}

            var favPostOptions = {
              url: "http://localhost:3000/api/favorites/",
              headers: {
              'userid' : testUserId,
              'Content-Type' : 'application/json',
              'accesstoken' : testAccessToken
            },

              body: JSON.stringify(favPostBody)
            }

            request.post(favPostOptions, function (err, res, body) {
              assert.equal(200, res.statusCode, "response was not a 200")
              var result = JSON.parse(res.body)
              assert.equal (testUserId, result.userId)
              assert.equal (postId, result.postId)

             var getUserFavsOptions = {
              url: "http://localhost:3000/api/favorites/user/",
              headers: {
              'userid' : testUserId,
              'Content-Type' : 'application/json',
              'accesstoken' : testAccessToken
            }

          }
            request.get(getUserFavsOptions, function (err, res, body) {
              assert.equal(200, res.statusCode, "response was not a 200")
              var result = JSON.parse(res.body)
              assert.equal(1, result.length)
              assert.equal(postId, result[0].postId)
              assert.equal(testUserId, result[0].user.userId)

              var deleteBody = {"userId": testUserId}
              var deleteOptions = {
                url: "http://localhost:3000/api/favorites/",
                headers: {
                'userid' : testUserId,
                'Content-Type' : 'application/json',
                'accesstoken' : testAccessToken
              },

              body: JSON.stringify(deleteBody)

            }
            request.del(deleteOptions, function (err, res, body) {
              assert.equal(200, res.statusCode, "response was not a 200")
              var val = JSON.parse(res.body)
              assert.equal("1", val.result.deleted)

              request.del(accountOptions, function (err, res, body) {

                var deletePostBody = {"postId": postId}
                var deletePostOptions = {
                  url: "http://localhost:3000/api/posts/",
                  headers: {
                  'userid' : testUserId,
                  'Content-Type' : 'application/json',
                  'accesstoken' : testAccessToken
                  },

                  body: JSON.stringify(deletePostBody)   
              }
              request.del(deletePostOptions)
              done()
      
            });
       
          });
       
        });

    });

  });

});

});

});