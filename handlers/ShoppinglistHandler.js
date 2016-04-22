// Well need the model of account
var Shoppinglist = require('../models/Shoppinglist')
var async = require('async')
var FB = require('fb')
var config = require('../config.js')
var r = require('rethinkdb')
var auth = require('../auth.js')
var http = require('http')

var ShoppinglistHandler = function () {
  this.getShoppinglist             = handleGetShoppinglistRequest
  this.postToShoppinglist          = handlePostShoppinglistRequest
  this.postItemsToShoppinglist     = handlePostItemsToShoppinglistRequest
  this.deleteItemsFromShoppinglist = handleDeleteItemsFromShoppinglistRequest
  this.deleteShoppinglist          = handleDeleteShoppinglistRequest
}

var connection = null;
r.connect( {host: config.rethinkdb.host, port: config.rethinkdb.port}, function(err, conn) {
  if (err) throw err;
  connection = conn
})

function handleGetShoppinglistRequest (req, res) {
  // NOTE: this get endpoint will not support queries as it does not make sense.
  Shoppinglist.filter( {"userId": parseInt(req.headers.userid)} ).run().then(function(list){
    res.status(200).send(JSON.stringify(list, null, 2))
  }).error(function(err){
    res.status(500).send({error: err.message})
  })
}

function handlePostItemsToShoppinglistRequest (req, res) {
  Shoppinglist.filter( {"userId": parseInt(req.headers.userid)} ).run().then(function(list){
    // Goes of if another shoppinglist is already found with the same userid
    if (list.length > 0){
      r.db(config.rethinkdb.db).table('shoppinglist').get(
        list[0].shoppinglistId).run(connection, function(err, cursor){
        if (err) throw err
      }).then(function(result) {
        var newShoppingList = {
          "shoppinglistId": result.shoppinglistId,
          "userId": parseInt(result.userId),
          "ingredients": result.ingredients.concat(req.body.ingredients)
        }
        r.db(config.rethinkdb.db).table('shoppinglist').get(
          list[0].shoppinglistId).update(newShoppingList).run(
          connection, function(err, cursor){
          if (err) throw err
        }).then(function(result) {
          res.json({
            result: result
          })
        })
      })
    }
    // If we dont find one create a new shoppinglist
    else{
      var shopppinglist = new Shoppinglist({
        userId: parseInt(req.headers.userid),
        ingredients: req.body.ingredients
      })
      shopppinglist.save().then(function (result){
        res.status(200).send(JSON.stringify(result))
      }).error(function (error) {
        console.log(error.message)
        res.status(500).send({error: error.message})
      })
    }
  }).error(function(err){
    res.status(500).send({error: err.message})
  })
}

function handlePostShoppinglistRequest (req, res) {
  Shoppinglist.filter( {"userId": parseInt(req.headers.userid)} ).run().then(function(list){
    // Goes of if another shoppinglist is already found with the same userid
    if (list.length > 0){
      r.db(config.rethinkdb.db).table('shoppinglist').get(
        list[0].shoppinglistId).update(req.body).run(
        connection, function(err, cursor){
        if (err) throw err
      }).then(function(result) {
        res.json({
          result: result
        })
      })
    }
    // If we dont find one create a new shoppinglist
    else{
      var shopppinglist = new Shoppinglist({
        userId: parseInt(req.headers.userid),
        ingredients: req.body.ingredients
      })
      shopppinglist.save().then(function (result){
        res.status(200).send(JSON.stringify(result))
      }).error(function (error) {
        console.log(error.message)
        res.status(500).send({error: error.message})
      })

    }
  }).error(function(err){
    res.status(500).send({error: err.message})
  })
}

function handleDeleteItemsFromShoppinglistRequest (req, res) {
  Shoppinglist.filter( {"userId": parseInt(req.headers.userid)} ).run().then(function(list){
    // Goes of if another shoppinglist is already found with the same userid
    r.db(config.rethinkdb.db).table('shoppinglist').get(
      list[0].shoppinglistId).run(connection, function(err, cursor){
      if (err) throw err
    }).then(function(result) {
      var newIngredients = result.ingredients.filter(
        function(value) {
        return req.body.ingredients.indexOf(value) < 0;
      });
      var newShoppingList = {
        "shoppinglistId": result.shoppinglistId,
        "userId": parseInt(result.userId),
        "ingredients": newIngredients
      }
      r.db(config.rethinkdb.db).table('shoppinglist').get(
        list[0].shoppinglistId).update(newShoppingList).run(
        connection, function(err, cursor){
        if (err) throw err
      }).then(function(result) {
        res.json({
          result: result
        })
      })
    })
  })
}

function handleDeleteShoppinglistRequest (req, res) {
  Shoppinglist.filter( {"userId": parseInt(req.headers.userid)} ).run().then(function(list){
    Shoppinglist.get(list[0].shoppinglistId).then(function(listtodelete){
      listtodelete.delete().then(function(result){
        res.status(200).send(JSON.stringify(result))
      })
    })
  }).error(function(err){
    res.status(500).send({error: err.message})
  })
}

module.exports = ShoppinglistHandler
