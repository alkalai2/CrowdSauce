var auth = require('./auth')

// Note prefix all with /api/
function setup (app, handlers) {
  // Add userId to list of users upon login
  app.post('/api/accounts/', /* auth.isAuthenticated, */ handlers.account.createAccount)
  app.get('/api/accounts/', /* auth.isAuthenticated, */ handlers.account.getAccount)
  app.put('/api/accounts/', /* auth.isAuthenticated, */ handlers.account.updateAccount)
  app.delete('/api/accounts/', /* auth.isAuthenticated, */ handlers.account.deleteAccount)
  // Add a new post for given userId
  app.post('/api/posts/', /* auth.isAuthenticated, */ handlers.post.createPost)
  app.get('/api/posts/', /* auth.isAuthenticated, */ handlers.post.getPost)
  app.put('/api/posts/', /* auth.isAuthenticated, */ handlers.post.updatePost)
  app.delete('/api/posts/', /* auth.isAuthenticated, */ handlers.post.deletePost)
}

exports.setup = setup
