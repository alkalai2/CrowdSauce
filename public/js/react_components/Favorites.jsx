/**
 * @jsx React.DOM
 */

var Favorites = React.createClass({
    
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
        self.loadPostIdsFromServer(fbDetails)
      }, function(error) {
        console.log("Error : " + error)
      })
    },

    loadPostIdsFromServer : function(fbDetails) {

        console.log("getting favorites from server..."); 
        jQuery.ajax({
          url:  this.props.source,
          type: 'GET',
          headers: {
            'Accept': 'text/html',
            'userid': fbDetails['fbUserID'],
            'accesstoken': fbDetails['fbAccessToken'],
          },
          dataType: 'json',
          timeout : 10000,
          success: function(data) {
            console.log(data)
            this.loadFullPostsFromServer(data, fbDetails)
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.source, status, err.toString());
          }.bind(this)
        }); 
    },

    loadFullPostsFromServer: function(data, fbDetails) {
      
      // using the postIds, load the full JSON data for each post
      posts_data = []  
      console.log("getting favorite posts from ids ...")
      for(d in data) {

          postId = data[d]['postId']
          console.log("postId to be called with : " + postId)
          var url = "http://localhost:3000/api/posts/"
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
              posts_data = posts_data.concat(data)
              this.setState({data: posts_data})
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(status, err.toString());
            }.bind(this)
          });
        }

      // console.log("favorites full post data : ")
      // console.log(posts_data)
      // // bind new post data to class
      // this.setState({data: posts_data})
    }, 

    render: function() {
   		return (
	    	<div> 
         {this.state.data &&
            <PostList 
              data={this.state.data} 
              favoriteAble={true}
              addNames={false}
              editable={false}
              errorMsg = {"You have no Favorites at the moment"}
            />
          } 
	    	</div>
	    );
    }
});

ReactDOM.render(<Favorites source={"http://localhost:3000/api/favorites/user/"}/>, posts);
