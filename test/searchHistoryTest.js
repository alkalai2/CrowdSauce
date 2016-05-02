var assert = require('assert')
expect = require('expect')
request = require('request')
app = require('../app')
testUserId = '112186842507184'
testAccessToken = 'CAAIAH9y5RLgBAKtjhOYDJwpJNcglmjXExqn7MtnaE4vZAHH3Q80AyoEOp71aKZBdxRPGjALstG2vRDhnZAvtXJIpyU4CafM0heYflHIFNK6ZBEt3wJdMZBNKNJMRAKuVSvPZCCh9pkwUjCtwKF5p3jHFDAnHYJXkYJUYG7ThjXm33SCql0lMTUZCy3kgMC6zgEWJLZBlEUt5HwZDZD';

//tests only run in debug mode because access token not updated
process.env.CRS_DEBUG = 1

var accountOptions = {
  url: "http://localhost:3000/api/accounts/",
  headers: {
    'userid': testUserId,
    'accesstoken': testAccessToken
  }
}

var postBody = {
  "title": "My recipe",
  "rating": 5,
  "directions": ["boil water", "cook"],
  "ingredients": ["salt", "pepper"],
  "images": ["google.com"],
  "notes": "stir",
  "recipeLink": "google.com",
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

//parametric tests
//Each test object is in the form {"testName": _, "search":[_], "length": {_}}
//The search field is a list of tags that will be searched for, the length is the expected length of user's searchHistory

var searchesList = []
var searchOne = {'testName': 'Search One', 'search': ['tasty'], 'length': 1}
var searchThree = {'testName': 'Search Three', 'search': ['spicy', 'chicken', 'jalapenos'], 'length': 3}
var searchRepeat = {'testName': 'Search Repeat', 'search': ['sweet', 'sweet'], 'length': 1}
var searchRepeatInBetween = {
  'testName': 'Search Repeat In Between',
  'search': ['sweet', 'salty', 'wonderful', 'sweet', 'chewy'],
  'length': 4
}
var searchEmpty = {'testName': 'Search Empty', 'search': [], 'length': 0}
searchesList.push(searchOne)
searchesList.push(searchThree)
searchesList.push(searchRepeat)
searchesList.push(searchRepeatInBetween)
searchesList.push(searchEmpty)

searchesList.forEach(function (search) {
  describe("Test " + search['testName'], function () {
    it("Search History", function (done) {
      //create an account for test user
      request.post(accountOptions, function (err, res, body) {
        var tagOptions = {
          url: "http://localhost:3000/api/tags/feed/?tagNames=" + String(search['search'].toString()),
          headers: {
            'userid': testUserId,
            'accesstoken': testAccessToken,
            'Content-Type': "application/json"
          }
        }
        //search for all the tags in search list
        request.get(tagOptions, function (err, res, body) {
          assert.equal(200, res.statusCode, "response was not a 200")
          request.get(accountOptions, function (err, res, body) {
            assert.equal(200, res.statusCode, "response was not a 200")
            var val = JSON.parse(res.body)
            console.log("SEARCH HISTORY: " + val[0].searchHistory)
            //check if the searchHistory list of the user is of the correct length
            assert.equal(search['length'], val[0].searchHistory.length)
            var deleteOptions = {
              url: "http://localhost:3000/api/accounts/",
              headers: {
                'userid': testUserId,
                'Content-Type': 'application/json',
                'accesstoken': testAccessToken
              }

            }
            //delete the test user's account
            request.del(deleteOptions, function (err, res, body) {
              assert.equal(200, res.statusCode, "response was not a 200")
              done()
            })
          })
        })
      });
    });
  });
});
