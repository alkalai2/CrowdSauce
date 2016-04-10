var config = require('../config.js')
var r = require('rethinkdb')

function sendCursorWithUser(res, cursor, connection) {
  cursor.toArray(function(err, result) {
    if (err) throw err;
    feed_result = result
    counter = 0
    result.forEach(function(elem, ind, arr){
      r.db(config.rethinkdb.db).table('users').get( elem['userId']).getField('name').run(connection, function (err, result){
        if (err) throw err
        arr[ind].name = result
        counter++
        if (counter === arr.length) {
          res.status(200).send(JSON.stringify(feed_result, null, 2))
        }
      })
    })
  })
}

exports.sendCursorWithUser = sendCursorWithUser
