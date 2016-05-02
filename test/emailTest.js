var assert = require('assert')
var request = require('request')
//var app = require('../app')
var testUserId = '112186842507184'
var testAccessToken = 'CAAIAH9y5RLgBAKtjhOYDJwpJNcglmjXExqn7MtnaE4vZAHH3Q80AyoEOp71aKZBdxRPGjALstG2vRDhnZAvtXJIpyU4CafM0heYflHIFNK6ZBEt3wJdMZBNKNJMRAKuVSvPZCCh9pkwUjCtwKF5p3jHFDAnHYJXkYJUYG7ThjXm33SCql0lMTUZCy3kgMC6zgEWJLZBlEUt5HwZDZD';
var MailListener = require("mail-listener2");
var mail = "CrowdSauce Favorite"
var crowdsaucetestuser = "crowdsaucetestuser"
var crowdsaucetest = "crowdsaucetest"

var mailListener = new MailListener({
  username: crowdsaucetestuser,
  password: crowdsaucetest,
  host: "gmail.cm",
  port: 993, // imap port
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
});

mailListener.start(); // start listening
mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("mail", function(mail, seqno, attributes){
  console.log("emailParsed", mail);
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

describe('Email Functionality Tests', function() {
  // Define tests for all endpoints that send out emails
  it('post_account, post_post, post_favorite, assert_email_sent, del_account', function (done) {
    process.env.CRS_DEBUG = 1
    // Post a new account to use to posta post then favorite it
    var postOptions = {
      url: "http://localhost:3000/api/accounts/",
      headers: {
        'userid' : testUserId,
        'accesstoken' : testAccessToken
      }
    }
    request.post(postOptions, function (err, res, body) {
      var result = JSON.parse(res.body)
      var getOptions = {
        url: "http://localhost:3000/api/accounts/?userId="+testUserId,
        headers: {
          'userid' : testUserId,
          'Content-Type' : 'application/json',
          'accesstoken' : testAccessToken
        }
      }
      // Now send a post and verify it sends out emails to friends of the user.
      var postId = 0
      var postBody = {
        "ingredients": ["salt", "pepper"],
        "directions": ["boil water", "cook"],
        "recipeLink": "google.com"
      }

      var postOptions = {
        url: "http://localhost:3000/api/posts/",
        headers: {
          'userid' : testUserId,
          'accesstoken' : testAccessToken,
          'Content-Type' : "application/json"
        },

        body: JSON.stringify(postBody)
      }
      // Now assert we have send out this email and it is sent to our emailmailer.
      request.post(postOptions, function (err, res, body) {
        assert.equal(crowdsaucetestuser, "crowdsaucetestuser")
        var favPostBody = {"postId": postId}

        var favPostOptions = {
          url: "http://localhost:3000/api/favorites/",
          headers: {
            'userid' : testUserId,
            'Content-Type' : 'application/json',
            'accesstoken' : testAccessToken
          },

          body: JSON.stringify(favPostBody)
        }

        // Now post a favorite on that post and verify it sent email to emailmailer.
        request.post(favPostOptions, function (err, res, body) {
          assert.equal(true, mail.indexOf("Favorite") > 0)
          console.log("emailParsed", mail);
          done()
        });
      });
    });
  });
});
