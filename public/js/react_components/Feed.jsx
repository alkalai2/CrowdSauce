/**
 * @jsx React.DOM
 */

var Input = ReactBootstrap.Input,
  Button = ReactBootstrap.Button

var SearchBar = React.createClass({
    render : function() {
      return (
        <div className="search-bar">
          <Input autoFocus className="search-input" type="text" placeholder=" What are you in the mood for? "/>
        </div>
      );    
    },
});

var Feed = React.createClass({
    
    getInitialState: function() {
      return {data: []}
    },
    getFBInfo: function() {
      return getFacebookDetails().then(function(d){return d})
    },
    componentDidMount: function() {
      var self = this
      getFacebookDetails().then(function(fbDetails) {
        console.log("Getting facebook details : " + fbDetails)
		FB.api(
		"/me/friends",
		function (response) {
			if (response && !response.error) {
				//handle the result 
				//console.log("friends: " + JSON.stringify(response, null, 4))
				// pass data to <FriendsList>
				self.setState({friends: response});
				console.log("set respond to friends")
				
			}
		}
		);		
        self.loadPostsFromServer(fbDetails)
      }, function(error) {
        console.log("Error : " + error)
      })
    },

    loadPostsFromServer : function(fbDetails) {

        console.log("getting posts from server..."); 
        var url = 
        jQuery.ajax({
          url:  this.props.source,
          type: 'GET',
          headers: {
            'Accept': 'text/html',
            'userid': fbDetails['fbUserID'],
            'accesstoken': fbDetails['fbAccessToken'],
            'numposts': '10'
          },
          dataType: 'json',
          timeout : 10000,
          success: function(data) {
            console.log("setting state with data ... ")
            console.log(data)
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.source, status, err.toString());
          }.bind(this)
        }); 
    },

	
	render: function() {
   		return (
	    	<div> 
			
			<div className="col-md-3">
			<FriendsList data={this.state.friends}/>
			</div>
			
			<div className ="col-md-6">
			
            <div>
              <SearchBar />
            </div>
            <PostList 
              data={this.state.data} 
              favoriteAble={true}
              errorMsg={"Oops! Your friends have not posted anything "}/>
			  
			</div>
			
			<div className="col-md-3">
			
			</div>
           
	    	</div>
	    );
    },
});

ReactDOM.render(<Feed source={"http://localhost:3000/api/posts/feed/"}/>, feed);
