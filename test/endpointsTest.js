var assert = require('assert')
    request = require('request')
    app = require('../app')
    testUserId = '112186842507184'
    testAccessToken = 'CAAIAH9y5RLgBAK24dLsfKTes9WJ3uJjnFM9nfUqpYEOpaOZBUQGITTZBiJGuC5CbZCxae1AfeU9sXdXBEIHRIa0Ctz8PCEwMfayCPClMLEaqIvtpQkb2w4zEZCCaK44Y9c1Vc2AC9xnCa0TpoZBbgGDQL1EVjmD2Hu8GLQLEscZBIrfPHBnsJxPa42TGvnswZBWZAyKXfHowqAZDZD';

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
        assert.equal("{\"userId\":"+testUserId+"}", res.body)
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
        var resultStr = JSON.stringify(res.body)
        resultStr = resultStr.replace(/\\/g, "").replace(/"/g, "").replace(/\n/g, "")
        var ex = 'userId: ' + testUserId
        assert.equal(true, resultStr.indexOf(ex) >= 0)
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
        var resultStr = JSON.stringify(res.body)
        resultStr = resultStr.replace(/\\/g, "").replace(/"/g, "")
        var ex = "deleted:1"
        ex = ex.replace(/'/g, "")
        assert.equal(true, resultStr.indexOf(ex) >= 0)
        done()
      });


  })
});
