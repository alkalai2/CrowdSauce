var nodemailer = require('nodemailer')

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

exports.send = send
