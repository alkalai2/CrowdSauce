var assert = require('assert')
request = require('request')
app = require('../app')
testUserId = '112186842507184'
testAccessToken = 'CAAIAH9y5RLgBAKtjhOYDJwpJNcglmjXExqn7MtnaE4vZAHH3Q80AyoEOp71aKZBdxRPGjALstG2vRDhnZAvtXJIpyU4CafM0heYflHIFNK6ZBEt3wJdMZBNKNJMRAKuVSvPZCCh9pkwUjCtwKF5p3jHFDAnHYJXkYJUYG7ThjXm33SCql0lMTUZCy3kgMC6zgEWJLZBlEUt5HwZDZD';

//Tests endpoints in PostHandler
describe('Post Endpoint Tests', function() {

  //tests only run in debug mode because access token not updated
  process.env.CRS_DEBUG = 1

  it('post, get, update, delete requests', function (done) {
    var postOptions = {
      url: "http://localhost:3000/api/accounts/",
      headers: {
        'userid' : testUserId,
        'accesstoken' : testAccessToken
      }
    }
    //create account for test user
    request.post(postOptions, function (err, res, body) {
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
      //create a new post and make sure all the fields are correct
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

          var updateBody = {"postId": postId, "directions": ["microwave", "stir"]}
          var updateOptions = {
            url: "http://localhost:3000/api/posts/",
            headers: {
              'userid' : testUserId,
              'Content-Type' : 'application/json',
              'accesstoken' : testAccessToken
            },

            body: JSON.stringify(updateBody)

          }

          //update post
          request.put(updateOptions, function (err, res, body) {
            assert.equal(200, res.statusCode, "response was not a 200")
            var val = JSON.parse(res.body)
            assert.equal("1", val.result.replaced)

            var deleteBody = {"postId": postId}

            var deleteOptions = {
              url: "http://localhost:3000/api/posts/",
              headers: {
                'userid' : testUserId,
                'Content-Type' : 'application/json',
                'accesstoken' : testAccessToken
              },

              body: JSON.stringify(deleteBody)

            }
            //delete test user's post
            request.del(deleteOptions, function (err, res, body) {
              assert.equal(200, res.statusCode, "response was not a 200")
              var val = JSON.parse(res.body)
              assert.equal(postId, val.postId)
              var deleteOptions = {
                url: "http://localhost:3000/api/accounts/",
                headers: {
                  'userid' : testUserId,
                  'Content-Type' : 'application/json',
                  'accesstoken' : testAccessToken
                }

              }
              //delete test user's account
              request.del(deleteOptions, function (err, res, body) {
                assert.equal(200, res.statusCode, "response was not a 200")
                var val = JSON.parse(res.body)
                done()
              });
            });
          });
        })
      });
    });
  });

});
