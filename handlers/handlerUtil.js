var config = require('../config.js')
var r = require('rethinkdb')

// converts the cursor to an array of posts then adds the username to each post
function doCursorWithUser(res, cursor, connection, callback) {
  cursor.toArray(function(err, result) {
    if (err) throw err;
    var feed_result = result
    if (feed_result.length == 0) {
      callback(feed_result)
      return
    }
    var counter = 0
    result.forEach(function(elem, ind, arr){
      r.db(config.rethinkdb.db).table('users').get(elem['userId']).getField('name').run(connection, function (err, result) {
        if (err) throw err
          arr[ind].name = result
        counter++
          if (counter === arr.length) {
          callback(feed_result)
        }
      })
    })
  })
}

// converts cursor to array and sends it
function sendCursor(res, cursor) {
  cursor.toArray(function(err, result) {
    if (err) throw err
      res.status(200).send(JSON.stringify(result, null, 2))
  })
}

exports.doCursorWithUser = doCursorWithUser
exports.sendCursor = sendCursor
