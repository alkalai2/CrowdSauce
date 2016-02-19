// Note prefix all with /api/
function setup (app, handlers) {
  app.post('/api/users/:username', handlers.account.createAccount)
  app.get('/api/users/:username', handlers.account.getAccount)
  app.put('/api/users/:username', handlers.account.updateAccount)
  app.delete('/api/users/:username', handlers.account.deleteAccount)
  app.post('/api/posts/:username', handlers.post.createPost)
  app.get('/api/posts/:username', handlers.post.getPost)
  app.put('/api/posts/:username', handlers.post.updatePost)
  app.delete('/api/posts/:username', handlers.post.deletePost)
}

exports.setup = setup
