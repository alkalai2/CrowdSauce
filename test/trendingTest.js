var assert = require('assert')
    request = require('request')
    app = require('../app')
    testUserId = '112186842507184'
    testAccessToken = 'CAAIAH9y5RLgBAKtjhOYDJwpJNcglmjXExqn7MtnaE4vZAHH3Q80AyoEOp71aKZBdxRPGjALstG2vRDhnZAvtXJIpyU4CafM0heYflHIFNK6ZBEt3wJdMZBNKNJMRAKuVSvPZCCh9pkwUjCtwKF5p3jHFDAnHYJXkYJUYG7ThjXm33SCql0lMTUZCy3kgMC6zgEWJLZBlEUt5HwZDZD';

process.env.CRS_DEBUG = 1

var postBody = {
  "title": "Something",
  "rating": 0,
  "prepTime": 0,
  "difficulty": "easy",
  "directions": [
    "cook"
  ],
  "ingredients": [
    "stuff"
  ],
  "images": [
    "string"
  ],
  "notes": "string",
  "recipeLink": "string"
}

var postOptions = {
  url: "http://localhost:3000/api/posts/",
  headers: {
    'userid': testUserId,
    'Content-Type': "application/json"
  },

  body: JSON.stringify(postBody)
}

var trendingOptions = {
    url: "http://localhost:3000/api/posts/trending/",
    headers: {
        'Content-Type': "application/json"
    },
}

// test for correctly posting a post
it("Posting a post", function(done){
    request.post(postOptions, function(err, res, body){
        body = JSON.parse(body)
        assert.equal(200, res.statusCode, "response was not a 200")
        assert.equal("Something", body.title, "not the correct post")
        done()
    })
})

// test for correctly retrieving trending posts
it("Getting trending posts", function(done){
    request.get(trendingOptions, function(err, res, body){
        body = JSON.parse(body)
        assert.equal(200, res.statusCode, "response was not a 200")
        assert.equal(3, body.length, "length not 3")
        done()
    })
})