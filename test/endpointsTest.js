var assert = require('assert')
    request = require('request')
    app = require('../app')
    testUserId = '112186842507184'
    testAccessToken = 'CAAIAH9y5RLgBAF9xxuEHTJiq3qUoteUbU1qCrk4GnMFgnT8xEXpA14BevJJDhQKsMPMurjOXEKBwlmibpWdWFgDzzSrPWW2jRjumZALvOVJtfuYkzTLwZAP1ZC4HkZCQxMfyczTBxwryFyvZBYn4Kg8ZArSrPdhfhX9SFZChFlekNLCqEvxrWCyuRo9StCZAjaCOrMNNzZBjxTwZDZD';

describe('Account Endpoint Tests', function() {

  it('post request', function (done) {

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
        done()
      });

  })

  it('get request', function (done) {

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
        done()
      });
  })

  it('delete request', function (done) {

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


  })
});

describe('Post Endpoint Tests', function() {

  it('post and get request', function (done) {
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
          assert.equal(1, result.length)
          assert.equal(2, result[0].ingredients.length)
          assert.equal("salt", result[0].ingredients[0])
          assert.equal("pepper", result[0].ingredients[1])
          assert.equal(2, result[0].directions.length)
          assert.equal("boil water", result[0].directions[0])
          assert.equal("cook", result[0].directions[1])
          done()
        })
      });

  })

  // it('get request', function (done) {

  //   var getOptions = {
  //     url: "http://localhost:3000/api/accounts/?userId="+testUserId,
  //     headers: {
  //     'userid' : testUserId,
  //     'Content-Type' : 'application/json',
  //     'accesstoken' : testAccessToken
  //   }
  // }
  //     request.get(getOptions, function (err, res, body) {
  //       assert.equal(200, res.statusCode, "response was not a 200")
  //       var resultStr = JSON.stringify(res.body)
  //       resultStr = resultStr.replace(/\\/g, "").replace(/"/g, "").replace(/\n/g, "")
  //       var ex = 'userId: ' + testUserId
  //       assert.equal(true, resultStr.indexOf(ex) >= 0)
  //       done()
  //     });
  // })

  // it('delete request', function (done) {

  //   var deleteOptions = {
  //     url: "http://localhost:3000/api/accounts/",
  //     headers: {
  //     'userid' : testUserId,
  //     'Content-Type' : 'application/json',
  //     'accesstoken' : testAccessToken
  //     }   

  //   }
  //     request.del(deleteOptions, function (err, res, body) {
  //       assert.equal(200, res.statusCode, "response was not a 200")
  //       var resultStr = JSON.stringify(res.body)
  //       resultStr = resultStr.replace(/\\/g, "").replace(/"/g, "")
  //       var ex = "deleted:1"
  //       ex = ex.replace(/'/g, "")
  //       assert.equal(true, resultStr.indexOf(ex) >= 0)
  //       done()
  //     });


  // })
});
