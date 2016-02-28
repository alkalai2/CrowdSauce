var FB = require('fb')

function isAuthenticated(req, res){
  if (!fbAppAccessToken) {
    console.error('Could not create post because there is no facebook app access token.')
    return
  }
  FB.api('/debug_token?', 'get', {
    input_token: req.body.accessToken,
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
