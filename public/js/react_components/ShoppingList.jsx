/**
 * @jsx React.DOM
 */

 var ListGroup = ReactBootstrap.ListGroup;
 var ListGroupItem = ReactBootstrap.ListGroupItem;
 Button = ReactBootstrap.Button;

// class to represent a single ingredient in a shopping list
// ingredients will control their own hover displays
// ingredients will handle their own 'remove ingredient' event
 var SingleShoppingItem = React.createClass({
  getInitialState : function() {
    return {added: false, hover: false, checked: false}
  },

  // make call to delete ingredient from shopping list
  // verify OK from server, rerender list of ingredients to display change
  onShoppingClick: function() {

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

  onCheckboxClick: function() {
    if(this.state.checked){
      this.props.onUnCheck(this.props.ingrName);
      this.setState({checked: !this.state.checked});
    }
    if(!this.state.checked){
      this.props.onCheck(this.props.ingrName);
      this.setState({checked: !this.state.checked});
    }
    
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
    <Button style={style} className="ingr-button" bsSize="xsmall" onChange={this.onShoppingClick}>remove</Button>

    return (
      <ListGroupItem onMouseEnter={this.mouseOver} onMouseLeave={this.mouseOut}> 
      <span>
      <input type="checkbox" className="ingredient-checkbox"  onClick={this.onCheckboxClick} />
      <span className="shopping-ingredient"> {this.props.ingrName} </span>
      <Button style={style} className="ingr-button" bsSize="xsmall" onClick={this.onShoppingClick}>remove</Button>
      </span> 
      </ListGroupItem>
      );
  }
});

// class to represent the Shopping List (list of ingredients)
// class will handle loading of all ingredients, setting display of ingredients
var ShoppingList = React.createClass({

  getInitialState: function() {
    return {data: [], checkedIngrs: []}
  },
  getFBInfo: function() {
    return getFacebookDetails().then(function(d){return d})
  },

  onCheck: function(ingrName){

    var newCheckedList = this.state.checkedIngrs.slice();
    newCheckedList.push(ingrName);
    this.setState({checkedIngrs: newCheckedList},function(){console.log(this.state.checkedIngrs);});

  },

  onUnCheck: function(ingrName){
    var newCheckedList = this.state.checkedIngrs.slice();

    for (var i=newCheckedList.length-1; i>=0; i--) {
      if (newCheckedList[i] === ingrName) {
        newCheckedList.splice(i, 1);
      }
    }

    this.setState({checkedIngrs: newCheckedList},function(){console.log(this.state.checkedIngrs);});


  },

  // delete all ingredients that have been checked for deletion
  deleteCheckedItems: function(){
    var url = 'http://localhost:3000/api/shoppinglist/items'
    var newIngrList = [];
    var checkList = this.state.checkedIngrs;
    var j = 0;
    var i = 0;
    for(j = this.state.data.length-1; j>=0; j--){
      var addToList = true;
      for (i = checkList.length-1; i>=0; i--) {
            if (checkList[i] === this.state.data[j]) {
              addToList = false;
            }
      }
      if(addToList){
        newIngrList.push(this.state.data[j])
      }
    }
    jQuery.ajax({
      url:  url,
      type: 'DELETE',
      headers: {
        'accessToken': fbAccessToken,
        'userId': fbUserID
      },
      dataType: 'json',
      data: {
        'ingredients': this.state.checkedIngrs
      },
      success: function(data) {
        console.log("removing " + this.state.checkedIngrs + " from shopping list")
        this.setState({data: newIngrList},function(){console.log(this.state.data)})
        this.forceUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });

  },

  reloadWithoutIngredient: function(ingrName) {
    data = this.state.data.filter(function(e){return e!==ingrName})
    this.setState({data: data})
    this.forceUpdate()
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

  // load the shopping list from the server
  // call api/shoppinglist/ endpoint to get data
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
      <ListGroup className="shopping-list-container" componentClass="div"> 
      {this.state.data.map(function(listValue){
        return <SingleShoppingItem ingrName={listValue} reloadWithoutIngredient={self.reloadWithoutIngredient} onCheck={self.onCheck} onUnCheck={self.onUnCheck}/>;
      })}
      </ListGroup>
      <Button  className="button remove-checked" bsSize="medium" onClick={this.deleteCheckedItems}>Remove Checked Items</Button>
      </div>
      );
  }
});

ReactDOM.render(<ShoppingList source={"http://localhost:3000/api/shoppinglist/"}/>, shoppinglist);
