var config = require('../config.js')
var r = require('rethinkdb')

function doCursorWithUser(res, cursor, connection, callback) {
  cursor.toArray(function(err, result) {
    if (err) throw err;
    feed_result = result
    if (feed_result.length == 0) {
      callback(feed_result)
      return
    }
    counter = 0
    result.forEach(function(elem, ind, arr){
      r.db(config.rethinkdb.db).table('users').get( elem['userId']).getField('name').run(connection, function (err, result){
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

function sendCursor(res, cursor) {
  cursor.toArray(function(err, result) {
    if (err) throw err
      res.status(200).send(JSON.stringify(result, null, 2))
  })
}

exports.doCursorWithUser = doCursorWithUser
exports.sendCursor = sendCursor
