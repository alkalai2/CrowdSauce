var assert = require('assert')
    request = require('request')
    app = require('../app')
    testUserId = '112186842507184'
    testAccessToken = 'CAAIAH9y5RLgBAARAlucV7mo1jaknDrR3ZBfvVEgYxL4lOUbKkaEP0paczeosZC0IpsSr0cez8j17NrioJVRMLupiLVoQTWAZB1PjFkKUgwB7NqVnj6SHGoZAGgiwJZBhtkIOFgdbuzkfa7ZCYltyrqGtWKViMZBp4Mj9fhvU4yeWPMuP7wUluHzPC9Evr5idEbRO0NrX2IVIwZDZD';

describe('Account Endpoint Tests', function() {

  it('post, get, delete request', function (done) {

    var postOptions = {
      url: "http://localhost:3000/api/accounts/",
      headers: {
      'userid' : testUserId,
      'accesstoken' : testAccessToken
    }
  }
      request.post(postOptions, function (err, res, body) {
        assert.equal(200, res.statusCode, "response was not a 200")
        var result = JSON.parse(res.body)
        assert.equal(testUserId, result.userId)
        var getOptions = {
          url: "http://localhost:3000/api/accounts/?userId="+testUserId,
          headers: {
          'userid' : testUserId,
          'Content-Type' : 'application/json',
          'accesstoken' : testAccessToken
        }
      }
        request.get(getOptions, function (err, res, body) {
          assert.equal(200, res.statusCode, "response was not a 200")
          var result = JSON.parse(res.body)
          assert.equal(1, result.length)
          assert.equal(testUserId, result[0].userId)
          
          var deleteOptions = {
            url: "http://localhost:3000/api/accounts/",
            headers: {
            'userid' : testUserId,
            'Content-Type' : 'application/json',
            'accesstoken' : testAccessToken
            }   

          }
          request.del(deleteOptions, function (err, res, body) {
            assert.equal(200, res.statusCode, "response was not a 200")
            var val = JSON.parse(res.body)
            assert.equal("1", val.result.deleted)
            done()
          });
        });
      });

  })

});

describe('Post Endpoint Tests', function() {

  it('post, get, update, delete requests', function (done) {
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
        assert.equal(200, res.statusCode, "response was not a 200")
        result = JSON.parse(res.body)
        assert.equal(testUserId, result.userId)
        assert.equal(2, result.ingredients.length)
        assert.equal("salt", result.ingredients[0])
        assert.equal("pepper", result.ingredients[1])
        assert.equal(2, result.directions.length)
        assert.equal("boil water", result.directions[0])
        assert.equal("cook", result.directions[1])
        assert.equal("google.com", result.recipeLink)
        postId = result.postId

        var getOptions = {
        url: "http://localhost:3000/api/posts/?postId="+postId,
        headers: {
        'userid' : testUserId,
        'Content-Type' : 'application/json',
        'accesstoken' : testAccessToken
      }
    }
        request.get(getOptions, function (err, res, body) {
          assert.equal(200, res.statusCode, "response was not a 200")
          var result = JSON.parse(res.body)
          //assert.equal(1, result.length)
          assert.equal(2, result[0].ingredients.length)
          assert.equal("salt", result[0].ingredients[0])
          assert.equal("pepper", result[0].ingredients[1])
          assert.equal(2, result[0].directions.length)
          assert.equal("boil water", result[0].directions[0])
          assert.equal("cook", result[0].directions[1])

          var updateBody = {"directions": ["microwave", "stir"]}
          var updateOptions = {
            url: "http://localhost:3000/api/posts/?postId="+postId,
            headers: {
            'userid' : testUserId,
            'Content-Type' : 'application/json',
            'accesstoken' : testAccessToken
            },

            body: JSON.stringify(updateBody)   

          }
          request.put(updateOptions, function (err, res, body) {
            assert.equal(200, res.statusCode, "response was not a 200")
            var val = JSON.parse(res.body)
            assert.equal("1", val.result.replaced)

             var deleteOptions = {
              url: "http://localhost:3000/api/posts/?postId="+postId,
              headers: {
              'userid' : testUserId,
              'Content-Type' : 'application/json',
              'accesstoken' : testAccessToken
              }   

            }
            request.del(deleteOptions, function (err, res, body) {
              assert.equal(200, res.statusCode, "response was not a 200")
              var val = JSON.parse(res.body)
              assert.equal("1", val.result.deleted)
              done()
            });
          });
        })
    });

  });

});

describe('Favorite Endpoint Tests', function() {

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
                var deletePostOptions = {
                  url: "http://localhost:3000/api/posts/?postId="+postId,
                  headers: {
                  'userid' : testUserId,
                  'Content-Type' : 'application/json',
                  'accesstoken' : testAccessToken
                  }   
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


