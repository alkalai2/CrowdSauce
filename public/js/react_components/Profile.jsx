/**
 * @jsx React.DOM
 */

// react class to represent a user's name on CrowdSauce
// the profile link will be clickable
// allow for navigation from a user's name to his/her posts
var ProfileLink = React.createClass({
  goToProfile: function() {
    this.props.profileNavigation(this.props.userId, this.props.userName)
  },

  render: function() {
    return (
      <span>
        <a className="profile-link" onClick={this.goToProfile}>
          {this.props.userName}
        </a>
      </span>
    )
  }
})


// class to represent the viewing of a single users' posts
// used after clicking a users' name, or viewing your own post history
var Profile = React.createClass({
    
    getInitialState: function() {
      return {data: []}
    },

    componentDidMount: function() {
      var self = this
      getFacebookDetails().then(function(fbDetails) {
        console.log("Getting facebook details : " + fbDetails)
        self.loadPostsFromServer(fbDetails)
      }, function(error) {
        console.log("Error : " + error)
      })
    },

    // use api/posts/ to get posts by a single user
    // if viewing the logged-in users posts (via My Profile), do not need userId provided
    // verify an OK from the server, then set state with post data received
    loadPostsFromServer : function(fbDetails) {
        userId = this.props.userId
        if (this.props.myprofile) {
          
          userId = fbDetails['fbUserID']
          console.log("setting my own profile " + userId)
        }

        console.log("getting posts from server..."); 
        var url = "http://localhost:3000/api/posts/"
        var data = {}
          
        jQuery.ajax({
          url:  url,
          type: 'GET',
          headers: {
            'Accept': 'text/html',
            'userid': fbDetails['fbUserID'],
            'accesstoken': fbDetails['fbAccessToken'],
            'numposts': '10'
          },
          dataType: 'json',
          data: {
            'userId': userId
          },
          timeout : 10000,
          success: function(data) {
            console.log("setting state with data ... ")
            console.log(data)
            if(data.length){
              this.setState({data: data});
            }
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.source, status, err.toString());
          }.bind(this)
        }); 
    },

    render: function() {

      // 
      var fbDetails = this.props.fbDetails
      if(this.props.fbDetails && !this.state.data.length) {
        this.loadPostsFromServer(this.props.fbDetails)
      } 

      // for showing profiles on feed
      var userDisplayBanner=''
      if(this.props.userDisplay) {
        userDisplayBanner = 

          <div className="user-banner" > Posts by <b>{this.props.userName} </b>... 
              <span className="back-to-feed"> 
                <a href="#" onClick={this.props.backToFeed}> back to feed </a> 
              </span>
          </div>
      }
   		return (
	    	<div> 
          <div>
            {userDisplayBanner}
          </div>
         {
            <PostList 
              data={this.state.data} 
              favoriteAble={true}
              addNames={false}
              editable={this.props.editable}
              errorMsg={"Could not find any posts :( "}
            />
          } 
	    	</div>
	    );
    }
});
