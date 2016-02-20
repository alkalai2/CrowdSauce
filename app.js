// ============================== Setup code ==================================
// Setup boilerplate code for server
var path = require('path')
var routes = require('./Routes')
var AccountHandler = require('./handlers/AccountHandler')
var PostHandler = require('./handlers/PostHandler')
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

// ============================== Handlers ====================================
var handlers = {
  account: new AccountHandler(),
  post: new PostHandler()
}
// ============================== Page Routing ================================
/*
 * Entry point to app - looks for index.html as landing page
 */
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/'))
})

// Generic error handling middleware.
app.use(handleError)

// access files in public folder
app.use(express.static('public'))

// ============================== Functions ===================================

/** Send back a 500 page and log the error to the console. **/
function handleError (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({err: err.message})
}

/** Store db connection and listen on port in configs **/
function startExpress (connection) {
  routes.setup(app, handlers)
  app._rdpConn = connection
  app.listen(config.express.port)
  console.log('Listening on port' + config.express.port)
  exports = module.exports = app
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
          rethink.tableCreate(tableName, {primaryKey: schema.tables[index].primaryKey})
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
