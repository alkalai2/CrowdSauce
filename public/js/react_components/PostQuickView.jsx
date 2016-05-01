
// react class to display a single Post on the main page
// used from Email notifications, or clicking a single post title
// not navigable from the main page, simplay a post-viewing option
var PostQuickView = React.createClass({
	  getInitialState: function() {
      return {post_data: {}}
    },

    componentDidMount: function() {
      var self = this
      getFacebookDetails().then(function(fbDetails) {
        console.log("Getting facebook details : " + fbDetails)
        self.loadPostFromServer(fbDetails)
      }, function(error) {
        console.log("Error : " + error)
      })
    },
  	
    // load the full post data given it's post id
    // use /api/posts with postId spec to get full data
  	loadPostFromServer: function(fbDetails) {
      post_data = []  
      console.log("getting post data to quickview ...")
      var postId = location.search.split('pid=')[1]
      if(!postId) {
        return
      }

      var url = "http://localhost:3000/api/posts"
      jQuery.ajax({
        url:  url,
        type: 'GET',
        headers: {
          'Accept': 'text/html',
          'userid': fbDetails['fbUserID'],
          'accesstoken': fbDetails['fbAccessToken'],
        },
        data : {
          'postId': postId
        },
        dataType: 'json',
        timeout : 10000,
        success: function(data) {
          console.log(data)

          if(data.length) {
            this.setState({post_data: data})
          } else {
            console.log("could not quickview postId " + postId)
          }
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(status, err.toString());
        }.bind(this)
      });
    },


  	render : function() {
  		return (
  		<div>
    		<PostList 
          data={this.state.post_data} 
          favoriteAble={true}
          errorMsg = {"Oops! Looks like this post does not exist"}/>
  		</div>
  		); 		
  	},
});

ReactDOM.render(<PostQuickView/>, posts);