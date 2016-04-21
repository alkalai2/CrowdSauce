// Well need the model of account
var Shoppinglist = require('../models/Shoppinglist')
var async = require('async')
var FB = require('fb')
var config = require('../config.js')
var r = require('rethinkdb')
var auth = require('../auth.js')
var http = require('http')

var ShoppinglistHandler = function () {
  this.getShoppinglist = handleGetShoppinglistRequest
  this.postShoppinglist = handlePostShoppinglistRequest
  this.deleteShopppinglist = handleDeleteShoppinglistRequest
}

var connection = null;
r.connect( {host: config.rethinkdb.host, port: config.rethinkdb.port}, function(err, conn) {
    if (err) throw err;
    connection = conn
})

function handleGetShoppinglistRequest (req, res) {
}

function handleGetAccountRequest (req, res) {
}

function handleUpdateAccountRequest (req, res) {
}

module.exports = ShoppinglistHandler
