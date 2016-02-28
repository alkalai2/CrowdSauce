var FB = require('fb')

// Note prefix all with /api/
function setup (app, handlers) {
  app.all('/api/posts/', function (req, res, next) {
    if (req.body.accessToken === undefined) {
      res.sendStatus(401)
      return
    } else if (!fbAppAccessToken) {
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
  })

  // Add userId to list of users upon login
  app.post('/api/accounts/', handlers.account.createAccount)
  app.get('/api/accounts/', handlers.account.getAccount)
  app.put('/api/accounts/', handlers.account.updateAccount)
  app.delete('/api/accounts/', handlers.account.deleteAccount)
  // Add a new post for given userId
  app.post('/api/posts/', handlers.post.createPost)
  app.get('/api/posts/', handlers.post.getPost)
  app.put('/api/posts/', handlers.post.updatePost)
  app.delete('/api/posts/', handlers.post.deletePost)
}

exports.setup = setup
