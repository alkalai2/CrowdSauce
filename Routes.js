// Note prefix all with /api/
function setup (app, handlers) {
	//Add userId to list of users upon login
  app.post('/api/users/:userId', handlers.account.createAccount)
  app.get('/api/users/:username', handlers.account.getAccount)
  app.put('/api/users/:username', handlers.account.updateAccount)
  app.delete('/api/users/:username', handlers.account.deleteAccount)
  	//Add a new post for given userId
  app.post('/api/posts/:userId', handlers.post.createPost)
  app.get('/api/posts/:username', handlers.post.getPost)
  app.put('/api/posts/:username', handlers.post.updatePost)
  app.delete('/api/posts/:username', handlers.post.deletePost)
}

exports.setup = setup
