var assert = require('assert')
request = require('request')
testUserId = '112186842507184'

describe('Shoppinglist Endpoint Tests', function() {
  it('post, get, delete request, item post, item delete', function (done) {
    process.env.CRS_DEBUG = 1
    // First create an account to create a shopping list for
    var postOptions = {
      url: "http://localhost:3000/api/accounts/",
      headers: {
        'userid' : testUserId,
      }
    }
    // Now post a shoppinglist for the created user. Testing POST /api/shoppinglist endpoint
    request.post(postOptions, function (err, res, body) {
      var postShopplinglistBody = {
        "ingredients": ["salt", "pepper"],
      }
      var postShoppinglistOptions = {
        url: "http://localhost:3000/api/shoppinglist/",
        headers: {
          'userid' : testUserId,
        },
        body: JSON.stringify(postShopplinglistBody)
      }
      request.post(postShoppinglistOptions, function(err, res, body) {
        assert.equal(200, res.statusCode, "response was not a 200")
        var getShoppinglistOptions = {
          url: "http://localhost:3000/api/shoppinglist/",
          headers: {
            'userid' : testUserId,
          }
        }
        // Now send GET request to /api/shoppinglist and verify that it contains items
        // Testing GET /api/shoppinglist endpoint
        request.get(getShoppinglistOptions, function (err, res, body) {
          assert.equal(200, res.statusCode, "response was not 200")
          var deleteShopplinglistItemsBody = {
            "ingredients": ["salt"],
          }
          // Now test DELETE /api/shoppinglist/items endpoint to verify we can delete
          // Some items from our users shoppinglist
          var deleteShoppinglistItemsOptions = {
            url: "http://localhost:3000/api/shoppinglist/items/",
            headers: {
              'userid' : testUserId,
            },
            body: JSON.stringify(deleteShopplinglistItemsBody)
          }
          request.del(deleteShoppinglistItemsOptions, function (err, res ,body) {
            assert.equal(200, res.statusCode, "response was 200")
            var deleteShoppinglistOptions = {
              url: "http://localhost:3000/api/shoppinglist/",
              headers: {
                'userid' : testUserId,
                'Content-Type' : 'application/json',
              }
            }
            // Now test DELETE /api/shoppinglist to verify we can delete the entire 
            // Created shoppinglist. 
            request.del(deleteShoppinglistOptions, function (err, res, body) {
              assert.equal(200, res.statusCode, "response was 200")
              var deleteOptions = {
                url: "http://localhost:3000/api/accounts/",
                headers: {
                  'userid' : testUserId,
                  'Content-Type' : 'application/json',
                }
              }
              // Now cleanup and delete the created user.
              request.del(deleteOptions, function (err, res, body) {
                done()
              })
            })
          })
        })
      })
    })
  })
})
