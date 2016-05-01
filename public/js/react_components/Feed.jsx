/**
 * @jsx React.DOM
 */

// React class to build a users' feed
// specifies a PostList.jsx object with specific Feed fields set
var Feed = React.createClass({
    
    getInitialState: function() {
      return {
        data: []
      }
    },
	componentDidMount : function() {
	
  	window.fbAsyncInit = function() {
  	FB.init({
  		appId      : '563086800536760',
  		cookie     : true,  // enable cookies to allow the server to access the session
  		xfbml      : true,  // parse social plugins on this page
  		version    : 'v2.5'
  	});
  	
  	}.bind(this);
  	// Load the SDK asynchronously
  	(function(d, s, id) {
  	var js, fjs = d.getElementsByTagName(s)[0];
  	if (d.getElementById(id)) return;
  	js = d.createElement(s); js.id = id;
  	js.src = "//connect.facebook.net/en_US/sdk.js";
  	fjs.parentNode.insertBefore(js, fjs);
  	}(document, 'script', 'facebook-jssdk'));
  	
  	$(document).on(
      'fbload', 
  	 function(){
  		FB.XFBML.parse();
  	});
	
	
      },
  	
  	componentDidUpdate : function() {
      FB.XFBML.parse();
  	},

    // use api/posts/feed/ endpoint to get a users' feed
    // with posts data, set state to rerender
    loadPostsFromServer : function(fbDetails) {

        console.log("getting posts from server..."); 
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
          timeout : 100000,
          success: function(data) {
            console.log("setting state with data ... ")
            console.log(data)
            if(data.length) { 
              this.setState({data: data});
            }
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.source, status, err.toString());
          }.bind(this)
        }); 
    },

	
	render: function() {

      var fbDetails = this.props.fbDetails
      if(this.props.fbDetails && !this.state.data.length) {
        this.loadPostsFromServer(this.props.fbDetails)
      } else {
        console.log("Could not load Feed posts. No access to Facebook Details")
      }
      
   		return (
  			<div>
          <PostList 
            data={this.state.data} 
            favoriteAble={true}
            searchBar = {true}
            addNames={true}
            editable={false}
            handleSearch={this.props.handleSearch}
            profileNavigation={this.props.profileNavigation}
            errorMsg={"Oops! Your friends have not posted anything "}/>
  			</div>
	    );
    },
});

