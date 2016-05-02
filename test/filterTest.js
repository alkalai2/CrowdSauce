var assert = require('assert')
request = require('request')
app = require('../app')

describe('filter tests', function () {

  // creates the accounts with the given userids
  function createAccounts(accounts, callback) {
    if (accounts.length == 0) {
      callback()
      return
    }
    request.post({
      url: "http://localhost:3000/api/accounts/",
      headers: {'userid': accounts[accounts.length - 1]}
    }, function (err, res, body) {
      //assert.equal(200, res.statusCode)
      accounts.pop()
      createAccounts(accounts, callback)
    })
  }

  // adds the given tags to the given post
  function addTags(post, tags, callback) {
    if (tags.length == 0) {
      callback()
      return
    }
    bod = '{"tagName": "' + tags[tags.length - 1] + '", "postId": "' + post + '"}'
    request.post({
      url: "http://localhost:3000/api/tags/",
      headers: {'Content-Type': 'application/json'},
      body: '{"tagName": "' + tags[tags.length - 1] + '", "postId": "' + post + '"}'
    }, function (err, res, body) {
      assert.equal(200, res.statusCode)
      tags.pop()
      addTags(post, tags, callback)
    })
  }

  // adds the given favorites to the given post
  function addFavorites(post, favorites, callback) {
    if (favorites.length == 0) {
      callback()
      return
    }
    request.post({
      url: "http://localhost:3000/api/favorites/",
      headers: {
        'Content-Type': 'application/json',
        'userid': favorites[favorites.length - 1]
      },
      body: '{"postId": "' + post + '"}'
    }, function (err, res, body) {
      assert.equal(200, res.statusCode)
      favorites.pop()
      addFavorites(post, favorites, callback)
    })
  }

  // creates posts under the given account with the given tags, ratings and favorites
  function createPosts(account, titles, tags, ratings, favorites, callback) {
    if (titles.length == 0) {
      callback()
      return
    }
    request.post({
      url: "http://localhost:3000/api/posts/",
      headers: {'userid': account},
      body: '{"title": "' + titles[titles.length - 1] + '", "rating": ' + ratings[ratings.length - 1] + '}'
    }, function (err, res, body) {
      body = JSON.parse(body)
      assert.equal(200, res.statusCode)
      addTags(body["postId"], tags[tags.length - 1], function() {
        addFavorites(body["postId"], favorites[favorites.length - 1], function() {
          titles.pop()
          tags.pop()
          ratings.pop()
          favorites.pop()
          createPosts(account, titles, tags, ratings, favorites, callback)
        })
      })
    })
  }

  // asserts that the tag feed with the given tags equals the given feed
  function assertFeed(account, tags, feed, callback) {
    request.get({
      url: "http://localhost:3000/api/tags/feed/?tagNames=" + tags,
      headers: {'userid': account}
    }, function (err, res, body) {
      assert.equal(200, res.statusCode)
      callback(JSON.parse(res.body))
    })
  }

  var adam = 100463527019300
  var brad = 107662552963871
  var greg = 153655315025677
  var dave = 104466886616471
  it('filter stuff', function (done) {
    process.env.CRS_DEBUG = 1
    createAccounts([adam, brad, greg, dave], function () {
      createPosts(
        adam,
        ['a', 'b', 'c', 'd', 'e'],
        [['ham'], ['soup'], ['soup', 'ham'], ['soup'], ['ham']],
        [1, 5, 3, 4, 1],
        [[brad, greg], [brad], [], [brad], [brad, greg, dave]],
        function () {
          assertFeed(adam, "rating:3", ['b', 'c', 'd'], function() {
            assertFeed(adam, "sort:favorites, soup", ['b', 'd', 'c'], function() {
              console.log("SUCCEED")
            })
          })
        }
      )
    })
  })
})
