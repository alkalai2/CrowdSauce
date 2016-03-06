var FB = require('fb')

function isAuthenticated(req, res, next) {
  if (req.headers.secret == fbAppSecret) {
    next()
    return
  } else if (req.headers.accesstoken === undefined) {
    console.log("No access token provided")
    res.sendStatus(401)
    return
  } else if (!fbAppAccessToken) {
    console.error('Could not create post because there is no facebook app access token')
    return
  }
  FB.api('/debug_token?', 'get', {
    input_token: req.headers.accesstoken,
    access_token: fbAppAccessToken
  }, function (response) {
    if (response.error) {
      console.log(error)
      res.sendStatus(401)
    } else if (!response.data.is_valid) {
      console.log('Invalid access attempted (' + req.headers.accesstoken + ')')
      res.sendStatus(401)
    } else if (response.data.user_id != req.headers.userid) {
      console.log("Access token's userId does not match given userId (" +
        response.data.user_id + " vs " + req.headers.userid + ")")
      res.sendStatus(401)
    } else {
      next()
    }
  })
}

exports.isAuthenticated = isAuthenticated
