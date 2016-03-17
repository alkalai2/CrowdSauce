var assert = require('assert')
    request = require('request')
    app = require('../app')
    testUserId = '112186842507184'
    testAccessToken = 'CAAIAH9y5RLgBAKtjhOYDJwpJNcglmjXExqn7MtnaE4vZAHH3Q80AyoEOp71aKZBdxRPGjALstG2vRDhnZAvtXJIpyU4CafM0heYflHIFNK6ZBEt3wJdMZBNKNJMRAKuVSvPZCCh9pkwUjCtwKF5p3jHFDAnHYJXkYJUYG7ThjXm33SCql0lMTUZCy3kgMC6zgEWJLZBlEUt5HwZDZD';

    describe('Account Endpoint Tests', function() {

  it('post, get, delete request', function (done) {

    process.env.CRS_DEBUG = 1

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