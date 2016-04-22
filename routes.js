var auth = require('./auth')

// Note prefix all with /api/
function setup (app, handlers) {
  app.all('/api/*', auth.isAuthenticated)

  // Add userId to list of users upon login
  app.post('/api/accounts/', handlers.account.createAccount)
  app.get('/api/accounts/', handlers.account.getAccount)
  app.put('/api/accounts/', handlers.account.updateAccount)
  app.delete('/api/accounts/', handlers.account.deleteAccount)
  app.post('/api/accounts/block/', handlers.account.blockAccount)
  app.delete('/api/accounts/block/', handlers.account.unblockAccount)

  // Add a new post for given userId
  app.post('/api/posts/', handlers.post.createPost)
  app.get('/api/posts/', handlers.post.getPost)
  app.get('/api/posts/feed/', handlers.post.getFeed)
  app.get('/api/posts/trending', handlers.post.getTrending)
  app.put('/api/posts/', handlers.post.updatePost)
  app.delete('/api/posts/', handlers.post.deletePost)

  app.get('/api/favorites/user/', handlers.favorites.getUserFavorites)
  app.get('/api/favorites/post/', handlers.favorites.getPostFavorites)
  app.post('/api/favorites/', handlers.favorites.createFavorites)
  app.put('/api/favorites/', handlers.favorites.updateFavorites)
  app.delete('/api/favorites/', handlers.favorites.deleteFavorites)

  // Shopping List
  app.get('/api/shoppinglist/', handlers.shoppinglist.getShoppinglist)
  app.post('/api/shoppinglist/', handlers.shoppinglist.postToShoppinglist)
  // Takes in data to add individual ingredients to list
  app.post('/api/shoppinglist/items/', handlers.shoppinglist.postItemsToShoppinglist)
  // Takes in data to delete individual shoppinglist items
  app.delete('/api/shoppinglist/items/', handlers.shoppinglist.deleteItemsFromShoppinglist)
  // Deletes entire shopping list
  app.delete('/api/shoppinglist/', handlers.shoppinglist.deleteShoppinglist)

  //Add tag to a post
  app.post('/api/tags/', handlers.tag.addTag)
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
