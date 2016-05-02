var assert = require('assert')
	expect = require('expect')
    request = require('request')
    app = require('../app')
    testUserId = '112186842507184'
    testAccessToken = 'CAAIAH9y5RLgBAKtjhOYDJwpJNcglmjXExqn7MtnaE4vZAHH3Q80AyoEOp71aKZBdxRPGjALstG2vRDhnZAvtXJIpyU4CafM0heYflHIFNK6ZBEt3wJdMZBNKNJMRAKuVSvPZCCh9pkwUjCtwKF5p3jHFDAnHYJXkYJUYG7ThjXm33SCql0lMTUZCy3kgMC6zgEWJLZBlEUt5HwZDZD';

    process.env.CRS_DEBUG = 1

    var accountOptions = {
      url: "http://localhost:3000/api/accounts/",
      headers: {
	      'userid' : testUserId,
	      'accesstoken' : testAccessToken
    	}
  	}

  	var postBody = {
  		"title": "My recipe",
  		"rating": 5,
	    "directions": ["boil water", "cook"],
	   	"ingredients": ["salt", "pepper"],
	   	"images": ["google.com"],
	   	"notes": "stir",
	    "recipeLink": "google.com",
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

	//These are five parametric tests
	//Each test object is in the form {"testName": _, "fields":[_], "input": {_}}
	//The fields consists of all the fields that will be updated, the input is the body that is being passed
	//into the update request
    var changesList = []
	var changeTitle = {"testName": "Change Post Title Only", "fields": ["title"], "input": {"title": "New Name"}}
	var changeRatingNotes = {"testName": "Change Post Rating and Notes", "fields": ["rating", "notes"], "input": {"rating": 3, "notes": "new note"}}
	var changeDirectionsImagesRecipeLink = {"testName": "Change Post Directions, Image Link, and Recipe Link", "fields": ["directions", "images", "recipeLink"], "input": {"directions": ["microwave"], "images": ["test.com"], "recipeLink": "testRecipes.com"}}
	var changeDirectionsIngredients = {"testName": "Change Post Directions and Ingredients", "fields": ["directions", "ingredients"], "input": {"directions": ["testing"], "ingredients": ["test"]}}
	var changePostId = {"testName": "Change Post PostId", "fields": ["postId"], "input": {"postId": 0}}

		changesList.push(changeTitle)
		changesList.push(changeRatingNotes)
		changesList.push(changeDirectionsImagesRecipeLink)
		changesList.push(changeDirectionsIngredients)
		changesList.push(changePostId)


		changesList.forEach(function (change) {
		    describe("Test " + change['testName'], function () {
		    	//postId should not be updated because that is the primary key in our Post model
		    	var shouldReplace = change['fields'].indexOf("postId") < 0
		    	var postId
		        it("Modified Post", function (done) {
		        	//create an account for test user
		        	request.post(accountOptions, function (err, res, body) {
        			assert.equal(200, res.statusCode, "response was not a 200")
        			request.post(postOptions, function(err, res, body){
        				assert.equal(200, res.statusCode, "response was not a 200")
        				var updateBody = change['input']
        				postId = JSON.parse(res.body).postId
        				updateBody['postId'] = postId
				        var updateOptions = {
				            url: "http://localhost:3000/api/posts/",
				            headers: {
				            'userid' : testUserId,
				            'Content-Type' : 'application/json',
				            'accesstoken' : testAccessToken
				            },

				            body: JSON.stringify(updateBody)   

		          		}
		          		//update the user's post
	          			request.put(updateOptions, function (err, res, body) {
	          				console.log("Error: "+ err)
		            		assert.equal(200, res.statusCode, "response was not a 200")
		            		var val = JSON.parse(res.body)
		            		if (shouldReplace)
		            			assert.equal("1", val.result.replaced)
		            		else
		            			assert.equal("0", val.result.replaced)
		            		var getOptions = {
					          url: "http://localhost:3000/api/posts/?postId="+postId,
					          headers: {
					          	'userid' : testUserId,
					          	'Content-Type' : 'application/json',
					          	'accesstoken' : testAccessToken
					        	}
					     	}
					     	//check if the correct fields have been replaced
				        	request.get(getOptions, function (err, res, body) {
	          					var result = JSON.parse(res.body)
	          					if (shouldReplace){
	          						for (i = 0; i < change['fields'].length; i++){
	          							var fieldName = change['fields'][i]
	          							for (j = 0; j < result[0][fieldName].length; j++)
	          								assert.equal(change['input'][fieldName][j], result[0][fieldName][j])
	          						}
	          					}
			            		var deleteOptions = {
					            	url: "http://localhost:3000/api/accounts/",
					            	headers: {
					            		'userid' : testUserId,
					            		'Content-Type' : 'application/json',
					            		'accesstoken' : testAccessToken
					        		}   

		          				}

		          				//delete the test user's account which should also delete the post
				          		request.del(deleteOptions, function (err, res, body) {
				            		assert.equal(200, res.statusCode, "response was not a 200")
				            		done()
				          		})
				     		})

	            		})

		       		});  
        		})
			          
		    });		
		});			


    });


