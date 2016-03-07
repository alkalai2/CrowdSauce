/**
 * @jsx React.DOM
 */

var Feed = React.createClass({
    
    getInitialState: function() {

      // return getFacebookDetails().then(function(fb_details){
      //   console.log("get facebook details : ", fb_details)
      //   return {data: [], fb_details: fb_details}
      // })
      return {data: []}
    },
    getFBInfo: function() {
      return getFacebookDetails().then(function(d){return d})
    },
    componentDidMount: function() {
      this.loadPostsFromServer()
    },

    loadPostsFromServer : function() {
      
      jQuery.ajax({
        url:  this.props.source,
        type: 'GET',
        headers: {
          'Accept': 'text/html',
          'userid': "112186842507184",
          'accesstoken': "CAAIAH9y5RLgBAJVr9O4I0RTMNffSCcvKbP0kurYQaLVfeEk3OrFlTaCLSYZADm0YMGr11ZA2uGJ0sxUjHiXFjHGtICd6k5C69oYKx1dF1kliRl9ZAZCd9ZAhy3UcBWfFsR2CjdU8ZBKzobZCKWfRo4ZCeeDvaIryxkPudvV4zxZBk1Jbx3tHwRZBkWOvQVwzyDSXEWAhccMFZBPV7pZBWNzmQp3P",
          'numposts': '10'
        },
        dataType: 'json',
        timeout : 10000,
        success: function(data) {
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
            <PostList data={this.state.data} />
          } 
	    	</div>
	    );
    }
});

ReactDOM.render(<Feed source="http://localhost:3000/api/posts/feed/" />, posts);
