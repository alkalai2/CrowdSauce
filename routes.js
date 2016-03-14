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
  app.get('/api/posts/feed/', handlers.post.getFeed)
  app.put('/api/posts/', handlers.post.updatePost)
  app.delete('/api/posts/', handlers.post.deletePost)

  app.post('/api/favorites/', handlers.favorites.createFavorites)
  app.get('/api/favorites/user/', handlers.favorites.getUserFavorites)
  app.get('/api/favorites/post/', handlers.favorites.getPostFavorites)
  app.put('/api/favorites/', handlers.favorites.updateFavorites)
  app.delete('/api/favorites/', handlers.favorites.deleteFavorites)

  //Create a new tag
  app.post('/api/tags/', handlers.tag.createTag)
  //Add an existing tag to a post
  app.post('/api/tags/post', handlers.tag.addTag)
  //Get all tags for given post
  app.get('/api/tags/post/', handlers.tag.getPostTags)
  //Get all posts for given tag
  app.get('/api/tags/feed/', handlers.tag.getTagFeed)
  //Get all tags
  app.get('/api/tags/', handlers.tag.getTags)
  //Update the name of a tag (currently non-functional)
  app.put('/api/tags/', handlers.tag.updateTag)
  //Delete a tag from db (used for testing)
  app.delete('/api/tags/name', handlers.tag.deleteTagName)
  //Delete one or all tag(s) from a post 
  app.delete('/api/tags/', handlers.tag.deleteTag)
}

exports.setup = setup
