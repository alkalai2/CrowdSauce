// ============================== Setup code ==================================
// Setup boilerplate code for server
var path = require('path')
var routes = require('./routes')
var AccountHandler = require('./handlers/AccountHandler')
var PostHandler = require('./handlers/PostHandler')
var FavoritesHandler = require('./handlers/FavoritesHandler')
var fileStreamRotator = require('file-stream-rotator')
var fs = require('fs')
var async = require('async')
var express = require('express')
var rethink = require('rethinkdb')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var FB = require('fb')
var swagger = require('swagger-node-express')
var util = require('util')

// Config file containing server and port information
var config = require(path.join(__dirname, '/config.js'))

// Obtain facebook app access token
fbAppSecret = fs.readFileSync('app_secret.txt', 'utf-8')
try {
  FB.api('/oauth/access_token?', 'get', {
    client_id: '563086800536760',
    client_secret: fbAppSecret,
    grant_type: 'client_credentials'
  }, function (response) {
    fbAppAccessToken = response.access_token
    init()
  })
} catch (e) {
  console.error('Could not obtain facebook app access token! This is probably because app_secret.txt is missing. ' +
    'Please create it and fill it with the App Secret found at ' +
    'https://developers.facebook.com/apps/563086800536760/dashboard/')
  fbAppAccessToken = false
  init()
}

function init() {
  // Run Express server to handle requests
  var app = express()
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())

  // Couple application to the Swagger module
  swagger.setAppHandler(app)

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

  // REST routes for
  /*
   app.route('/addUser')
   .get(addUserFromFacebook) // Get is currently just to test endpoint
   .post(addUserFromFacebook)
   */
  app.use(express.static('public'))

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'))
  })

  app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/login.html'))
  })

  app.get('/postrecipe', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/postrecipe.html'))
  })

  app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/about.html'))
  })

  // Something bad happened
  // app.use(handle404)

  // ============================== Handlers ====================================
  var handlers = {
    account: new AccountHandler(),
    post: new PostHandler(),
    favorites: new FavoritesHandler()
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
  function handleError(err, req, res, next) {
    console.error(err.stack)
    res.status(500).json({err: err.message})
  }

  /** Store db connection and listen on port in configs **/
  function startExpress(connection) {
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
  }
], function (err, connection) {
  if (err) {
    console.error(err)
    process.exit(1)
    return
  }

    startExpress(connection)
  })
}
