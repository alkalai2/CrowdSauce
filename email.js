var nodemailer = require('nodemailer')
var FB = require('fb')
var config = require('./config.js')
var r = require('rethinkdb')
var fs = require('fs')
var format = require('string-format')
var Account = require('./models/Account.js')

var connection = null;
r.connect({host: config.rethinkdb.host, port: config.rethinkdb.port}, function (err, conn) {
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

function send(address, subject, message, post, userId) {
  console.log("IN SEND message " + message + " post: " + post + " userid " + userId)
  fs.readFile('./emailtemplate.html', function (err, htmlemail) {
    if (err) {
      throw err
    }
    Account.filter({"userId": parseInt(userId)}).run().then(function (user) {
      var emailString = String(htmlemail)
      emailString = format(emailString, post, user[0], message)
      var mailOptions = {
        from: 'sandbox7f347118c7b442168631b62f2b9c82b2.mailgun.org',
        to: address,
        subject: subject,
        html: emailString
      }
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) return console.log(error)
        console.log('Message sent to ' + address + ': ' + info.response)
      })
    }).error(function (err) {
      throw(err)
    })
  })
}

function sendToUser(user, subject, message, post) {
  r.db(config.rethinkdb.db).table('users').get(user).run(connection, function (err, result) {
    if (result) {
      var emailAddress = result.email
      if (emailAddress == "")
        return;
      var notification = result.notification
      var name = result.name
      if (notification) {
        send(emailAddress, subject, message, post, user)
      }
    }
  })
}

function sendToFriends(user, subject, message, post) {
  FB.api('/' + user + '/friends?fields=email,name,id', 'get', {
    access_token: fbAppAccessToken
  }, function (response) {
    if (response.error) {
      console.log(response.error)
      return
    }
    for (var i = 0; i < response.data.length; i++) {
      if (!response.data[i].email) continue
      var userId = response.data[i].id
      r.db(config.rethinkdb.db).table('users').get(parseInt(response.data[i].id)).run(connection, function (err, result) {
        if (result) {
          var emailAddress = result.email
          var notification = result.notification
          var name = result.name
          if (notification) {
            send(emailAddress, subject, message, post, userId)
          }
        }
      })
    }
  })
}

exports.send = send
exports.sendToFriends = sendToFriends
exports.sendToUser = sendToUser
