/**
 * @jsx React.DOM
 */

var ShoppingList = React.createClass({
    
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
        self.loadShoppingListFromServer(fbDetails)
      }, function(error) {
        console.log("Error : " + error)
      })
    },

    loadShoppingListFromServer : function(fbDetails) {

        console.log("getting the shopping list from server..."); 
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
   		return (
	    	<div> 
         <ul>
          {this.state.data.map(function(listValue){
            return <li>{listValue}</li>;
          })}
        </ul>
	    	</div>
	    );
    }
});

ReactDOM.render(<ShoppingList source={"http://localhost:3000/api/shoppinglist/"}/>, shoppingList);
