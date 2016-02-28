var FB = require('fb')

function isAuthenticated(req, res, next) {
  if (req.headers.accessToken === undefined) {
    res.sendStatus(401)
    return
  } else if (!fbAppAccessToken) {
    console.error('Could not create post because there is no facebook app access token')
    return
  }
  FB.api('/debug_token?', 'get', {
    input_token: req.headers.accessToken,
    access_token: fbAppAccessToken
  }, function (response) {
    if (!response.data.is_valid) {
      console.log('Invalid access attempted')
      res.sendStatus(401)
    } else {
      next()
    }
  })
}

exports.isAuthenticated = isAuthenticated
