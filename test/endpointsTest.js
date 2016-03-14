var assert = require('assert')
    request = require('request')
    app = require('../app')
    testUserId = '112186842507184'
    testAccessToken = 'CAAIAH9y5RLgBAMyj9ujrqSvqMWHGZCXuEXnK2aBQoDG8owLDxC7Lr0czeSezY63aj9MARvu6c8lKkGdAjcxRLYNafNYTkDKKhMZBxZBiSiOr3qY8LxPX71tHbQGqQTg1rj4rdvOaSLoMdpuuUQM46JSPMc4jxmeyxGINPjRLjKleZAdRMpf6mmKBVbDaI1yYFHMpZAU15IAZDZD';

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

describe('Tag Endpoint Tests', function() {
  it('post, get, delete requests', function (done) {
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
      var tagBody = {"tagName": "breakfast", "postId": postId}
      var tagOptions = {
        url: "http://localhost:3000/api/tags/",
        headers: {
          'userid' : testUserId,
          'Content-Type' : 'application/json',
          'accesstoken' : testAccessToken
        },
        body: JSON.stringify(tagBody)
      }

      request.post(tagOptions, function (err, res, body) {
        assert.equal(200, res.statusCode, "response was not a 200")
        var result = JSON.parse(res.body)
        assert.equal ("breakfast", result.tagName)

        var getTagsOptions = {
          url: "http://localhost:3000/api/tags/",
          headers: {
            'userid' : testUserId,
            'Content-Type' : 'application/json',
            'accesstoken' : testAccessToken
          }
        }
          request.get(getTagsOptions, function(err, res, body){
            assert.equal(200, res.statusCode, "response was not a 200")
            var result = JSON.parse(res.body)
            console.log("RESULT: "+ res.body)
            var contains = false
            for (i = 0; i< result.length;  i++){
              if (result[i].tagName == "breakfast")
                contains = true
            }

            assert.equal(true, contains)
          })

          var getPostTagsOptions = {
            url: "http://localhost:3000/api/tags/post/?postId="+ postId,
            headers: {
              'userid' : testUserId,
              'Content-Type' : 'application/json',
              'accesstoken' : testAccessToken
            }
          }

          request.get(getPostTagsOptions, function(err, res, body){
            assert.equal(200, res.statusCode, "response was not a 200")
            var result = JSON.parse(res.body)
            var contains = false
            for (i = 0; i< result.length;  i++){
              if (result[i].tagName == "breakfast")
                contains = true
            }

            assert.equal(true, contains)
          })

          var deleteTagBody = {"tagName": "breakfast"}
          var deleteTagOptions = {
            url: "http://localhost:3000/api/tags/name",
            headers: {
            'userid' : testUserId,
            'Content-Type' : 'application/json',
            'accesstoken' : testAccessToken
          },

          body: JSON.stringify(deleteTagBody)

          }
          request.del(deleteTagOptions, function (err, res, body) {
            assert.equal(200, res.statusCode, "response was not a 200")
            var val = JSON.parse(res.body)
            assert.equal("1", val.result.deleted)
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
  



