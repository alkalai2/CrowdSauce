var auth = require('./auth')

// Note prefix all with /api/
function setup (app, handlers) {
  app.all('/api/*', auth.isAuthenticated)

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
