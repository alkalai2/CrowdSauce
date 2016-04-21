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
  this.postItemsToShoppinglist     = handlePostShoppinglistRequest
  this.deleteItemsFromShoppinglist = handleDeleteShoppinglistRequest
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

function handlePostShoppinglistRequest (req, res) {
  Shoppinglist.filter( {"userId": parseInt(req.headers.userid)} ).run().then(function(list){
    // Goes of if another shoppinglist is already found with the same userid
    if (list.length > 0){
      r.db(config.rethinkdb.db).table('shoppinglist').filter(
        {"shoppinglistId": list[0].shoppinglistId}).update(req.body).run(
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

function handleDeleteShoppinglistRequest (req, res) {
  //Shoppinglist.get(parseInt(req.body.userId)).k

}

module.exports = ShoppinglistHandler
