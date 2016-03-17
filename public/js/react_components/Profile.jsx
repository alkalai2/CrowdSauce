/**
 * @jsx React.DOM
 */

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

    loadPostsFromServer : function(fbDetails) {
        console.log("getting posts from server..."); 
        var url = "http://localhost:3000/api/posts/"
        var data = {}
        if(this.props.userId) {
          data = {
            'userId': this.props.userId
          }
        }
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
          data: data,
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

      // Jank - necessary to get data from FeedController
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
              errorMsg={"Could not find any posts :( "}
            />
          } 
	    	</div>
	    );
    }
});
