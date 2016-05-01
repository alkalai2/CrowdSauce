// Master Controller for feed. Handles changing of displays, data on /feed page. 


var FeedController = React.createClass({
		getInitialState: function() {
			return {
				
				/*
				 * 'feed' 		-> main feed of posts
				 * 'search' 	-> search results
				 * 'profile'	-> user profiles
				 */
				displayType: 'feed',
				query: '',
				profileUserId: '',
			}
		},
		
		idToProfilePic: function (id) {
			FB.api("/" + id + "/picture", function (response) {
				if (response && !response.error) {
					return (response["data"]["url"])
				}
			});
		},
		
		componentWillMount:function() {
			var trendArray = 
			jQuery.ajax({
			url:  "http://localhost:3000/api/posts/trending/",
			type: 'GET',
			headers: {
				'Accept': 'text/html',
				'userid': fbDetails['fbUserID'],
				'accesstoken': fbDetails['fbAccessToken'],
				'numposts': '5'
			},
			dataType: 'json',
			timeout : 100000,
			success: function(data) {
				console.log("data trending ... ")
				console.log(data)
				if(data.length) { 
				this.setState({trends: data});
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.error('data trending', status, err.toString());
			}.bind(this)
			}); 		
		},
		
		// get facebook details, facebook friends
		componentDidMount: function() {
			var self = this
			getFacebookDetails().then(function(fbDetails) {
				console.log("Getting facebook details : ")
				console.log(fbDetails)

				FB.api( "/me/friends", function (response) {
					if (response && !response.error) {
						//handle the result 
						console.log("friends: " + JSON.stringify(response, null, 4))
						// pass data to <FriendsList>
						self.setState({friends: response})
						console.log("set respond to friends")
						self.setState({fbDetails: fbDetails})
						friendsID = response["data"].map(function(friend_data) {
							return (
								friend_data.id
							)
						})
						console.log("friends id", JSON.stringify(friendsID))
						var friendsProfileURL = {}
						friendsID.map(function (id) {	

							// query database for each friends profile picture
														var url =
							jQuery.ajax({
								url:  'http://localhost:3000/api/accounts/',
								type: 'GET',
								headers: {
									'Accept': 'text/html',
									'userid': fbDetails['fbUserID'],
									'accesstoken': fbDetails['fbAccessToken'],
								},
								dataType: 'json',
								data: {
									'userId': id
								},
								timeout : 100000,
								success: function(data) {
									console.log("saving friends picture ... ")
									console.log(data[0])
									if(data[0] === undefined) {
										FB.api("/" + id + "/picture", function (response) {
 											if (response && !response.error) {
 												console.log("friend id ", id, " friends url", JSON.stringify(response["data"]["url"]))
 												friendsProfileURL[id] = response["data"]["url"]
 												self.setState({profileurls: friendsProfileURL})
 												console.log("friends url", JSON.stringify(friendsProfileURL))
 											}
 										});
									}
									else {
										friendsProfileURL[id] = data[0].picture
										self.setState({profileurls: friendsProfileURL})
									}
								}.bind(this),
								error: function(xhr, status, err) {
								console.error('http://localhost:3000/api/accounts/', status, err.toString());
								}.bind(this)
							}); 	
							
							
						})
				}
			});
				
			})	
		},

		// a Search has come in
		// pass query onto Search to load results
		// change display to show search results
		handleSearchQuery: function(query) {
			if(query) {
				this.setState(
					{	
						displayType: 'search',
						query: query
					}
				)
			}
		},

		handleBackToFeed: function() {
			this.setState({displayType: 'feed'})
		},

		handleProfileNavigation: function(userId, userName) {
			this.setState({
					displayType: 'profile',
					profileUserId: userId,
					profileUserName: userName 
				})
		},

		handleShoppingListAddition: function(ingrName) {
			this.refs['shoppinglist'].reloadWithIngredient(ingrName)
		},

    render : function() {
    	console.log("rendering Feed Controller")
    	console.log(this.state.displayType)
		


    	/* Set the Main Display */

    	var mainDisplay = ''
    	switch(this.state.displayType) {

    		/* Feed */
    		case('feed'):
    			console.log("setting display for feed")
    			mainDisplay = 
                    <div>
                        <SearchBar handleSearch={this.handleSearchQuery}/>
                        <div>
            				<Feed 
            					fbDetails = {this.state.fbDetails}
        	    				source={"http://localhost:3000/api/posts/feed/"}
        	    				handleSearch = {this.handleSearchQuery}
        	    				profileNavigation={this.handleProfileNavigation}
        	    				handleShoppingListAddition = {this.handleShoppingListAddition}/>
                        </div>
                    </div>

    			break;

    		/* Search Results */
    		case('search'):
    			mainDisplay = 
    				<div>
    					<SearchBar handleSearch={this.handleSearchQuery}/>
    					<div>
    						<SearchResults 
    							query={this.state.query}
    							handleSearch={this.handleSearchQuery} 
    							backToFeed={this.handleBackToFeed}
    							fbDetails={this.state.fbDetails}/>
    					</div>
    				</div>
    			break;

    		/* Profile Pages */
    		case('profile'):
    			mainDisplay = 
    				<Profile 
    					profileNavigation={this.handleProfileNavigation} 
    					backToFeed={this.handleBackToFeed}
    					userId={this.state.profileUserId}
    					userName={this.state.profileUserName}
    					userDisplay={true}
    					editable={false}
    					fbDetails={this.state.fbDetails}
    					backToFeed={this.handleBackToFeed} />
    			break;
    	}

      return (	
        <div className="row">
    	  <div> 	

    			<div className="col-md-3">
    				<FriendsList 
    					data={this.state.friends}
						profileurls={this.state.profileurls}
    					profileNavigation={this.handleProfileNavigation}/>
    			</div>
   
    			<div className ="col-md-6">
    			 	{mainDisplay}
    			</div>
    			
    			<div className="col-md-3">
    				<div>
    					<TrendsList 
    						data={this.state.trends} />	
    				</div>
    				<div>	
    					<ShoppingList ref="shoppinglist" source={"http://localhost:3000/api/shoppinglist/"}/>	
    				</div>		
    			</div>
    	  </div>
          <div> <PostRecipe/></div>
        </div>
      );    
    },
});


ReactDOM.render(<FeedController />, feed);

