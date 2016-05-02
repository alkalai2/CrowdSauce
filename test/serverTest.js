var assert = require('assert')
    request = require('request')
    app = require('../app');

//Basic tests to ensure server is running correctly
describe('Basic Server Tests', function() {

  it('site url should return 200', function (done) {

      var crowdsauce_url = "http://localhost:3000"

      request.get(crowdsauce_url, function (err, res, body) {
        assert.notEqual(undefined, res, "No response at localhost:3000")
        assert.equal(200, res.statusCode, "response was not a 200")
        done()
      })
    });
	it('index page url should return 200', function (done) {

      var crowdsauce_url = "http://localhost:3000/index.html"

      request.get(crowdsauce_url, function (err, res, body) {
        assert.notEqual(undefined, res, "No response at localhost:3000")
        assert.equal(200, res.statusCode, "response was not a 200")
        done()
      })
    });
});
