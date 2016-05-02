var assert = require('assert')
    request = require('request')
    app = require('../app')
    testUserId = '112186842507184'
    testAccessToken = 'CAAIAH9y5RLgBAKtjhOYDJwpJNcglmjXExqn7MtnaE4vZAHH3Q80AyoEOp71aKZBdxRPGjALstG2vRDhnZAvtXJIpyU4CafM0heYflHIFNK6ZBEt3wJdMZBNKNJMRAKuVSvPZCCh9pkwUjCtwKF5p3jHFDAnHYJXkYJUYG7ThjXm33SCql0lMTUZCy3kgMC6zgEWJLZBlEUt5HwZDZD';

//tests endpoints in TagHandler
describe('Tag Endpoint Tests', function () {

  //tests only run in debug mode because access token not updated
  process.env.CRS_DEBUG = 1

  it('post, get, delete requests', function (done) {
    var postOptions = {
      url: "http://localhost:3000/api/accounts/",
      headers: {
        'userid': testUserId,
        'accesstoken': testAccessToken
      }
    }
    //create an account for test user
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
          'userid': testUserId,
          'accesstoken': testAccessToken,
          'Content-Type': "application/json"
        },

        body: JSON.stringify(postBody)
      }
      //have test user make a post
      request.post(postOptions, function (err, res, body) {
        var result = JSON.parse(res.body)
        postId = result.postId
        var tagBody = {"tagName": "breakfast", "postId": postId}
        var tagOptions = {
          url: "http://localhost:3000/api/tags/",
          headers: {
            'userid': testUserId,
            'Content-Type': 'application/json',
            'accesstoken': testAccessToken
          },
          body: JSON.stringify(tagBody)
        }
        //have test user add a tag to that post
        request.post(tagOptions, function (err, res, body) {
          assert.equal(200, res.statusCode, "response was not a 200")
          var result = JSON.parse(res.body)
          assert.equal("breakfast", result.tagName)

          var getTagsOptions = {
            url: "http://localhost:3000/api/tags/",
            headers: {
              'userid': testUserId,
              'Content-Type': 'application/json',
              'accesstoken': testAccessToken
            }
          }
          //check if that tag is added to our database of tag names
          request.get(getTagsOptions, function (err, res, body) {
            assert.equal(200, res.statusCode, "response was not a 200")
            var result = JSON.parse(res.body)
            console.log("RESULT: " + res.body)
            var contains = false
            for (i = 0; i < result.length; i++) {
              if (result[i].tagName == "breakfast")
                contains = true
            }

            assert.equal(true, contains)
          })

          var getPostTagsOptions = {
            url: "http://localhost:3000/api/tags/post/?postId=" + postId,
            headers: {
              'userid': testUserId,
              'Content-Type': 'application/json',
              'accesstoken': testAccessToken
            }
          }
          //check if that tag is added to the post
          request.get(getPostTagsOptions, function (err, res, body) {
            assert.equal(200, res.statusCode, "response was not a 200")
            var result = JSON.parse(res.body)
            var contains = false
            for (i = 0; i < result.length; i++) {
              if (result[i].tagName == "breakfast")
                contains = true
            }

            assert.equal(true, contains)
          })

          var deleteTagBody = {"tagName": "breakfast"}
          var deleteTagOptions = {
            url: "http://localhost:3000/api/tags/name",
            headers: {
              'userid': testUserId,
              'Content-Type': 'application/json',
              'accesstoken': testAccessToken
            },

            body: JSON.stringify(deleteTagBody)

          }
          //remove tag from post
          request.del(deleteTagOptions, function (err, res, body) {
            assert.equal(200, res.statusCode, "response was not a 200")
            var val = JSON.parse(res.body)
            assert.equal("1", val.result.deleted)
            var deleteOptions = {
              url: "http://localhost:3000/api/accounts/",
              headers: {
                'userid': testUserId,
                'Content-Type': 'application/json',
                'accesstoken': testAccessToken
              }

            }
            //delete test user's account, which should also delete post
            request.del(deleteOptions, function (err, res, body) {
              assert.equal(200, res.statusCode, "response was not a 200")
              done()
            });
          })
        });
      });
    });
  });
});
