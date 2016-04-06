var assert = require('assert')
	expect = require('expect')
    request = require('request')
    app = require('../app')
    testUserId = '112186842507184'
    testAccessToken = 'CAAIAH9y5RLgBAKtjhOYDJwpJNcglmjXExqn7MtnaE4vZAHH3Q80AyoEOp71aKZBdxRPGjALstG2vRDhnZAvtXJIpyU4CafM0heYflHIFNK6ZBEt3wJdMZBNKNJMRAKuVSvPZCCh9pkwUjCtwKF5p3jHFDAnHYJXkYJUYG7ThjXm33SCql0lMTUZCy3kgMC6zgEWJLZBlEUt5HwZDZD';

    process.env.CRS_DEBUG = 1

    var postOptions = {
      url: "http://localhost:3000/api/accounts/",
      headers: {
      'userid' : testUserId,
      'accesstoken' : testAccessToken
    }
  }
        var changesList = []
		var changeEmail = {"testName": "Change Email", "field": "email", "input": {"email": "test@email.com"}}
		var changeNotification = {"testName": "Change Notification", "field": "notification", "input": {"notification": false}}
		var changePicture = {"testName": "Change Picture", "field": "picture", "input": {"picture": "testPicture"}}
		var changeName = {"testName": "Change Name", "field": "name", "input": {"name": "test user"}}
		var changeUserId = {"testName": "Change UserId", "field": "userId", "input": {"userId": 0000000}}

		changesList.push(changeEmail)
		changesList.push(changeNotification)
		changesList.push(changePicture)
		changesList.push(changeName)
		changesList.push(changeUserId)


		changesList.forEach(function (change) {
		    describe("Test " + change['testName'], function () {
		    	var shouldReplace = change['field'] != "userId"
		        it("Modified Account", function (done) {
		        	request.post(postOptions, function (err, res, body) {
        			assert.equal(200, res.statusCode, "response was not a 200")
			          var updateBody = change['input']
			          var updateOptions = {
			            url: "http://localhost:3000/api/accounts/",
			            headers: {
			            'userid' : testUserId,
			            'Content-Type' : 'application/json',
			            'accesstoken' : testAccessToken
			            },

			            body: JSON.stringify(updateBody)   

	          		}

	          		request.put(updateOptions, function (err, res, body) {
	          			console.log("Error: "+ err)
		            	assert.equal(200, res.statusCode, "response was not a 200")
		            	var val = JSON.parse(res.body)
		            	if (shouldReplace)
		            		assert.equal("1", val.result.replaced)
		            	else
		            		assert.equal("0", val.result.replaced)
		            	var getOptions = {
					          url: "http://localhost:3000/api/accounts/?userId="+testUserId,
					          headers: {
					          'userid' : testUserId,
					          'Content-Type' : 'application/json',
					          'accesstoken' : testAccessToken
					        }
					     }
				        request.get(getOptions, function (err, res, body) {
	          				var result = JSON.parse(res.body)
	          				if (shouldReplace)
	          					assert.equal(change['input']['field'], result[change['field']])
			            	var deleteOptions = {
					            url: "http://localhost:3000/api/accounts/",
					            headers: {
					            'userid' : testUserId,
					            'Content-Type' : 'application/json',
					            'accesstoken' : testAccessToken
					        	}   

		          			}
				          request.del(deleteOptions, function (err, res, body) {
				            assert.equal(200, res.statusCode, "response was not a 200")
				            done()
				          })
				     })

	            	})

		       });  
		    });		
		});			


    });


