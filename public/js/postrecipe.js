var Tabs = ReactBootstrap.Tabs,
Tab = ReactBootstrap.Tab,
Input = ReactBootstrap.Input,
ButtonInput = ReactBootstrap.ButtonInput


var PostRecipe = React.createClass({

    getInitialState: function(){
        return {activeTabId: 1};
    },
    
    handleSelect(selectedKey){
        this.setState({activeTabId: selectedKey});
    },
    
    render: function() {

        return (  
            <div>
            <Tabs defaultActiveKey={this.state.activeTabId}>
            <Tab eventKey={1} title="Link to Recipe"><RecipeLinkForm /></Tab>
            <Tab eventKey={2} title="Post the Recipe Yourself"><RecipeCustomForm /></Tab>
            </Tabs>
            </div>);
    }
});

var Picture = React.createClass({

    getInitialState: function() {
        return {src: ''};
    },


    render: function() {
        return (
            <div>
            
            </div>
            );
    }
});

// From React homepage tutorials
var IngredientList = React.createClass({
    render: function() {
        var createItem = function(item) {
            return <li key={item.id}>{item.text}</li>;
        };
        return <ul>{this.props.items.map(createItem)}</ul>;
    }
});

var RecipeCustomForm = React.createClass({
  getInitialState: function() {
    return {items: [], title:'', text: '', directions: '', imgsrc:'http://i.imgur.com/SyZyVmN.jpg'};
},
handleTitleChange: function(e){
    this.setState({title: e.target.value});
},
onChange: function(e) {
    this.setState({text: e.target.value});
},
onDirectionsChange: function(e) {
    this.setState({directions: e.target.value});
},
changeImgSrc: function(e) {
    this.setState({imgsrc: e.target.value});
},
addIngredient: function() {
    var nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
},
handleSubmit: function(){
    //unpackaging the ingredients array
    var items = "";
    for(var i = 0; i < this.state.items.length; i++){
        items += this.state.items[i].text + ' ';
    }
    console.log(items.trim());
    
    var data = { 
      ingredients: items.trim(),
      directions: this.state.directions.trim(),
      imageLinks: this.state.imgsrc.trim()
    }
    console.log("data : " + data.toString())
      jQuery.ajax({
          url: 'http://localhost:3000/api/posts/12345',
          dataType: 'json',
          type: 'POST',
          data: data,
          success: function(data) {
            console.log("Successfully added recipe to db")
            //alert(data);
            //this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
            console.error('http://localhost:3000/api/posts/12345', status, err.toString());
        }.bind(this)
    });
  },
  render: function() {
    return (
        <div>
        <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <Input
        type="text"
        label="Title"
        placeholder="Mom's Spaghetti"
        labelClassName="col-xs-2" 
        wrapperClassName="col-xs-10"
        bsStyle={this.state.title.length > 0 ? 'success' : 'error'}
        value={this.state.title}
        onChange={this.handleTitleChange}
        />
        <Input 
        type="text"
        label="Ingredients"
        labelClassName="col-xs-2" 
        wrapperClassName="col-xs-10"
        onChange={this.onChange} 
        value={this.state.text} 
        />
        <ButtonInput bsStyle="default" onClick={this.addIngredient}>Add Ingredient</ButtonInput>
        <IngredientList items={this.state.items} />
        <Input
        type="textarea"
        label="Directions"
        labelClassName="col-xs-2" 
        wrapperClassName="col-xs-10"
        onChange={this.onDirectionsChange}
        value={this.state.directions} 
        />
        <h3>Add a Picture</h3>
        <img src={this.state.imgsrc} alt="Add a picture!" 
        height='200px' width='200px' className="img-responsive"/>
        <Input type="text"
        label="Image URL"
        labelClassName="col-xs-2" 
        wrapperClassName="col-xs-10"
        onChange={this.changeImgSrc} 
        value={this.state.imgsrc} 
        />
        <ButtonInput type="submit" value="Post" bsStyle="success" bsSize="large" />
        </form>
        </div>
        );
}
});

var RecipeLinkForm = React.createClass({

    getInitialState: function(){
        return {title:'', link:'', description:''};
    },


    handleTitleChange: function(e){
        this.setState({title: e.target.value});
    },
    handleLinkChange: function(e){
        this.setState({link: e.target.value});
    },
    handleDescChange: function(e){
        this.setState({description: e.target.value});
    },
    handleSubmit: function(){
    var link = this.state.link.trim();
    var data = { 
      recipeLink: link
    }
      jQuery.ajax({
          url: 'http://localhost:3000/api/posts/12345',
          dataType: 'json',
          type: 'POST',
          data: data,
          success: function(data) {
            console.log("Successfully added recipe to db")
        }.bind(this),
        error: function(xhr, status, err) {
            console.error('http://localhost:3000/api/posts/12345', status, err.toString());
        }.bind(this)
    });
  },


    render: function(){
        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <Input
            type="text"
            label="Title"
            placeholder="Mom's Spaghetti"
            labelClassName="col-xs-2" 
            wrapperClassName="col-xs-10"
            bsStyle={this.state.title.length > 0 ? 'success' : 'error'}
            value={this.state.title}
            onChange={this.handleTitleChange}
            />
            <Input
            type="text"
            label="Link"
            placeholder="http://allrecipes.com/..."
            labelClassName="col-xs-2" 
            wrapperClassName="col-xs-10"
            bsStyle={this.state.link.length > 0 ? 'success' : 'error'}
            value={this.state.link}
            onChange={this.handleLinkChange}
            />
            <Input
            type="textarea"
            label="Add a Description"
            labelClassName="col-xs-2" 
            wrapperClassName="col-xs-10"
            value={this.state.description}
            onChange={this.handleDescChange}
            />
            <ButtonInput type="submit" value="Post" bsStyle="success" bsSize="large" />
            </form>
            );
}
});



ReactDOM.render(<PostRecipe />, content);
