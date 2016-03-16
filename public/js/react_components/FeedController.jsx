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

		// get facebook details, facebook friends
		componentDidMount: function() {
			var self = this
      getFacebookDetails().then(function(fbDetails) {
        console.log("Getting facebook details : ")
        console.log(fbDetails)

				FB.api( "/me/friends", function (response) {
					if (response && !response.error) {
						//handle the result 
						//console.log("friends: " + JSON.stringify(response, null, 4))
						// pass data to <FriendsList>
						self.setState({friends: response})
						console.log("set respond to friends")
						self.setState({fbDetails: fbDetails})
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
    				<Feed 
    					fbDetails = {this.state.fbDetails}
	    				source={"http://localhost:3000/api/posts/feed/"}
	    				handleSearch = {this.handleSearchQuery}
	    				profileNavigation={this.handleProfileNavigation}/>

    			break;

    		/* Search Results */
    		case('search'):
    			mainDisplay = 
    				<div>
    					<SearchBar handleSearch={this.handleSearchQuery}/>
    					<div>
    						<SearchResults 
    							query={this.state.query} 
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
    					fbDetails={this.state.fbDetails}
    					backToFeed={this.handleBackToFeed} />
    			break;
    	}

      return (	
    
    	  <div> 	

    			<div className="col-md-3">
    				<FriendsList 
    					data={this.state.friends}
    					profileNavigation={this.handleProfileNavigation}/>
    			</div>
   
    			<div className ="col-md-6">
    			 	{mainDisplay}
    			</div>
    			
    			<div className="col-md-3">
    			</div>
    	  </div>
      );    
    },
});


ReactDOM.render(<FeedController />, feed);

