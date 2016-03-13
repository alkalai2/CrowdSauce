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
        self.loadPostsFromServer(fbDetails)
      }, function(error) {
        console.log("Error : " + error)
      })
    },

    loadPostsFromServer : function(fbDetails) {

        console.log("getting posts from server..."); 
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
         {this.state.data &&
            <PostList data={this.state.data} favoriteAble={false}/>
          } 
	    	</div>
	    );
    }
});

ReactDOM.render(<Favorites source={"http://localhost:3000/api/favorites/user/"}/>, posts);
