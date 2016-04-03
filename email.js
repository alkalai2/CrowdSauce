var nodemailer = require('nodemailer')
var FB = require('fb')
var config = require('./config.js')
var r = require('rethinkdb')

var connection = null;
r.connect( {host: config.rethinkdb.host, port: config.rethinkdb.port}, function(err, conn) {
  if (err) throw err;
  connection = conn
})

var poolConfig = {
  pool: true,
  host: 'smtp.mailgun.org',
  port: 465,
  secure: true,
  auth: {
    user: 'postmaster@sandbox7f347118c7b442168631b62f2b9c82b2.mailgun.org',
    pass: 'da059f8e679cf2eb6c36f64b92e20d0c'
  }
}
var transporter = nodemailer.createTransport(poolConfig)

function send(address, subject, message) {
  var mailOptions = {
    from: 'sandbox7f347118c7b442168631b62f2b9c82b2.mailgun.org',
    to: address,
    subject: subject,
    html: message
  }
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) return console.log(error)
    console.log('Message sent to ' + address + ': ' + info.response)
  })
}

function sendToUser(user, subject, message) {
  r.db(config.rethinkdb.db).table('users').get(user).run(connection, function (err, result) {
    if (result) {
      var emailAddress = result.email
      if (emailAddress == "") 
        return;
      var notification = result.notification
      var name = result.name
      if (notification){
          send(emailAddress, subject, message)
      }
    }
  })
}

function sendToFriends(user, subject, message) {
  FB.api('/' + user + '/friends?fields=email,name,id', 'get', {
    access_token: fbAppAccessToken   
  }, function (response) {
    if (response.error) {
      console.log(response.error)
      return
    }
    for (i = 0; i < response.data.length; i++) {
      if (!response.data[i].email) continue
      r.db(config.rethinkdb.db).table('users').get(parseInt(response.data[i].id)).run(connection, function (err, result) {
        if (result) {
            var emailAddress = result.email
            var notification = result.notification
            var name = result.name
            if (notification){
              send(emailAddress, subject, message)
            }
        }
      })
    }
  })
}

exports.send = send
exports.sendToFriends = sendToFriends
exports.sendToUser = sendToUser
