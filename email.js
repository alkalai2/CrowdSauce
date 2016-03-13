var nodemailer = require('nodemailer')
var FB = require('fb')

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
  FB.api('/' + user + '?fields=email,name', 'get', {
    access_token: fbAppAccessToken
  }, function (response) {
    if (response.error) {
      console.log(util.inspect(response.error))
    } else if (!response.email) {
      console.log("User " + response.name + " (" + response.id + ") does not seem to have email permissions.")
    } else {
      send(response.email, subject, message)
    }
  })
}

function sendToFriends(user, subject, message) {
  FB.api('/' + user + '/friends?fields=email,name', 'get', {
    access_token: fbAppAccessToken
  }, function (response) {
    if (response.error) {
      console.log(response.error)
      return
    }
    for (i = 0; i < response.data.length; i++) {
      if (!response.data[i].email) continue
      send(response.data[i].email, subject, message)
    }
  })
}

exports.send = send
exports.sendToFriends = sendToFriends
exports.sendToUser = sendToUser
