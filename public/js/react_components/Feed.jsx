/**
 * @jsx React.DOM
 */

var Feed = React.createClass({
    
    getInitialState: function() {
      return {
        data: []
      }
    },
    componentDidMount: function() {
      // var self = this
      // getFacebookDetails().then(function(fbDetails) {
      //   console.log("Getting facebook details : ")
      //   console.log(fbDetails)	
      //   self.loadPostsFromServer(fbDetails)
      // }, function(error) {
      //   console.log("Error : " + error)
      // })
      // fbDetails =  {
      //   'fbUserID': fbUserID,
      //   'fbAccessToken': fbAccessToken
      // }
      // if(this.props.fbDetails) {
      //  this.loadPostsFromServer(this.props.fbDetails)
      // } else {
      //   console.log("Could not load Feed posts. No access to Facebook Details")
      // }
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

      // Jank - necessary to get data from FeedController
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
            handleSearch={this.props.handleSearch}
            profileNavigation={this.props.profileNavigation}
            errorMsg={"Oops! Your friends have not posted anything "}/>
  			</div>
	    );
    },
});

