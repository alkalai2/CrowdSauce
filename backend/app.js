// ============================== Setup code ==================================
// Setup boilerplate code for server
var path = require('path')
var fileStreamRotator = require('file-stream-rotator')
var fs = require('fs')
var async = require('async')
var express = require('express')
var rethink = require('rethinkdb')
var morgan = require('morgan')

// Config file containing server and port information
var config = require(path.join(__dirname, '/config.js'))

// Run Express server to handle requests
var app = express()

// Morgan used for logging
// https://github.com/expressjs/morgan
var logDirectory = path.join(__dirname, '/log')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = fileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

// ============================== REST Routes =================================
// REST routes for
app.route('/addUser')
  .get(addUserFromFacebook) // Get is currently just to test endpoint
  .post(addUserFromFacebook)

// Something bad happened
app.use(handle404)

// Generic error handling middleware.
app.use(handleError)

// ============================== Functions ===================================
/** Page-not-found **/
function handle404 (req, res, next) {
  res.status(404).end('not found')
}

/** Send back a 500 page and log the error to the console. **/
function handleError (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({err: err.message})
}

/** Store db connection and listen on port in configs **/
function startExpress (connection) {
  app._rdpConn = connection
  app.listen(config.express.port)
  console.log('Listening on port' + config.express.port)
}

/*
 * The response object that's provided to your callback contains a number of fields:
 *
 * {
 *     status: 'connected',
 *     authResponse: {
 *         accessToken: '...',
 *         expiresIn:'...',
 *         signedRequest:'...',
 *         userID:'...
 *     }
 * }
 * status specifies the login status of the person using the app. The status
 *   can be one of the following:
 *
 * * connected. The person is logged into Facebook, and has logged into your app.
 * * not_authorized. The person is logged into Facebook, but has not logged
 *     into your app.
 * * unknown. The person is not logged into Facebook, so you don't know if
 *     they've logged into your app. Or FB.logout() was called before and therefore,
 *     it cannot connect to Facebook.
 * * authResponse is included if the status is connected and is made up of the following:
 * * accessToken. Contains an access token for the person using the app.
 * * expiresIn. Indicates the UNIX time when the token expires and needs to be renewed.
 * * signedRequest. A signed parameter that contains information about the person
 *     using the app.
 * * userID is the ID of the person using the app.
*/

/** Adds a user with json response from facebook **/
function addUserFromFacebook (req, res, next) {
  // TODO: Figure out what is returned in response from facebook upon login.
  console.log('Add user endpoint called')
}

// ============================== Start Server ================================
/*
 * Connect to rethinkdb, create the needed tables/indexes and then start express.
 * Create tables/indexes then start express
 * Partial Code taken from RethinkDB + Express guide
 * https://rethinkdb.com/docs/examples/node-todo/
 */
async.waterfall([
  function connect (callback) {
    rethink.connect(config.rethinkdb, callback)
  },
  function createDatabase (connection, callback) {
    // Create the database if needed.
    rethink.dbList().contains(config.rethinkdb.db).do(function (containsDb) {
      return rethink.branch(
        containsDb,
        {created: 0},
        rethink.dbCreate(config.rethinkdb.db)
      )
    }).run(connection, function (err) {
      callback(err, connection)
    })
  },
  function createTables (connection, callback) {
    var schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'))
    for (var index in schema.tables) {
      var tableName = schema.tables[index].tableName
      // Create the table if needed.
      rethink.tableList().contains(tableName).do(function (containsTable) {
        return rethink.branch(
          containsTable,
          {created: 0},
          rethink.tableCreate(tableName)
        )
      }).run(connection, function (err) {
        callback(err, connection)
      })
    }
  }
], function (err, connection) {
  if (err) {
    console.error(err)
    process.exit(1)
    return
  }

  startExpress(connection)
})

// TODO: Setup everything else
