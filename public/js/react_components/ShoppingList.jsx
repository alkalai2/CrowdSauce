/**
 * @jsx React.DOM
 */

var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
Button = ReactBootstrap.Button;

var SingleShoppingItem = React.createClass({
  getInitialState : function() {
    return {added: false, hover: false}
  },

  onShoppingClick: function() {

    // TO DO - change this query to the correct 'DELETE' request
    var url = 'http://localhost:3000/api/shoppinglist/items'
    jQuery.ajax({
      url:  url,
      type: 'DELETE',
      headers: {
        'accessToken': fbAccessToken,
        'userId': fbUserID
      },
      dataType: 'json',
      data: {
        'ingredients': [this.props.ingrName]
      },
      success: function(data) {
        console.log("removing " + this.props.ingrName + " from shopping list")
        this.props.reloadWithoutIngredient(this.props.ingrName)
        this.setState({added: !this.state.added})
        this.forceUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
    
  },

  mouseOver: function () {
      this.setState({hover: true});
  },
  
  mouseOut: function () {
      this.setState({hover: false});
  },

  render: function() {
    var style = this.state.hover ? {visibility: 'inherit'} : {visibility: 'hidden'}

    button = this.state.added ? 
      <span className="tag label label-success ingr-image-holder"><img className="ingr-ok-icon" src="img/glyphicons/png/glyphicons-207-ok.png"></img></span>:
      <Button style={style} className="ingr-button" bsSize="xsmall" onClick={this.onShoppingClick}>remove</Button>

      return (
          <ListGroupItem onMouseEnter={this.mouseOver} onMouseLeave={this.mouseOut}> 
            <span>
              {this.props.ingrName} 
              <Button style={style} className="ingr-button" bsSize="xsmall" onClick={this.onShoppingClick}>remove</Button>
            </span> 
          </ListGroupItem>
      );
  }
});

var ShoppingList = React.createClass({
    
    getInitialState: function() {
      return {data: []}
    },
    getFBInfo: function() {
      return getFacebookDetails().then(function(d){return d})
    },
    reloadWithoutIngredient: function(ingrName) {
      data = this.state.data.filter(function(e){return e!==ingrName})
      this.setState({data: data})
      this.forceUpdate()
    },
    reloadWithIngredient: function(ingrName) {
      if(this.state.data.indexOf(ingrName) < 0) {
        this.setState({data: data.push(ingrName)})
        this.forceUpdate()
      }    
    },
    componentDidMount: function() {
      // var self = this
      // getFacebookDetails().then(function(fbDetails) {
      //   console.log("Getting facebook details : " + fbDetails)
      //   self.loadShoppingListFromServer(fbDetails)
      // }, function(error) {
      //   console.log("Error : " + error)
      // })
      var self = this
      setTimeout(function(){ self.loadShoppingListFromServer()}, 3000);
      
    },

    loadShoppingListFromServer : function() {

        console.log("getting the shopping list from server..."); 
        jQuery.ajax({
          url:  this.props.source,
          type: 'GET',
          headers: {
            'accessToken': fbAccessToken,
            'userId': fbUserID
          },
          dataType: 'json',
          timeout : 10000,
          success: function(response) {
            console.log(response)
            data = response[0].ingredients
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
      var self = this
   		return (
	    	<div>
            <span><h2> Shopping List </h2> </span>             
            <ListGroup className="shopping-list-container" componentClass="div"> 
              {this.state.data.map(function(listValue){
                return <SingleShoppingItem ingrName={listValue} reloadWithoutIngredient={self.reloadWithoutIngredient}/>;
              })}
            </ListGroup>
	    	</div>
	    );
    }
});

// ReactDOM.render(<ShoppingList source={"http://localhost:3000/api/shoppinglist/"}/>, shoppinglist);
