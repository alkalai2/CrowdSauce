// Account Schema, taken form Express example code at https://github.com/vgheri/ShopWithMe
/*
 * The response object that's provided to your callback contains a number of fields:
 *
 * {
 *     status: 'connected',
 *     authResponse: {
 *         accessToken: '...',
 *         expiresIn:'...',
 *         signedRequest:'...',
 *         userID:'...
 *     }
 * }
 * status specifies the login status of the person using the app. The status
 *   can be one of the following:
 *
 * * connected. The person is logged into Facebook, and has logged into your app.
 * * not_authorized. The person is logged into Facebook, but has not logged
 *     into your app.
 * * unknown. The person is not logged into Facebook, so you don't know if
 *     they've logged into your app. Or FB.logout() was called before and therefore,
 *     it cannot connect to Facebook.
 * * authResponse is included if the status is connected and is made up of the following:
 * * accessToken. Contains an access token for the person using the app.
 * * expiresIn. Indicates the UNIX time when the token expires and needs to be renewed.
 * * signedRequest. A signed parameter that contains information about the person
 *     using the app.
 * * userID is the ID of the person using the app.
*/
// This is tentative but seems like a good way to serialize users
var path = require('path')
var config = require('../config.js')
var thinky = require('thinky')(config.rethinkdb);
var r = thinky.r;
var type = thinky.type;

// This should model the schema we want in our RethinkDB
var Favorites = thinky.createModel("favorites", {
    userId: type.string(),
    postIds: type.array()
}, {pk: "userId"} );

module.exports = Favorites
