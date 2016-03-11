var Panel = ReactBootstrap.Panel,
PanelGroup = ReactBootstrap.PanelGroup,
Input = ReactBootstrap.Input,
ButtonInput = ReactBootstrap.ButtonInput,
Pagination = ReactBootstrap.Pagination

var ReactTags = require(['react-tag-input']);

var PostRecipe = React.createClass({
    getInitialState: function(){
        return {activeKey: 1, title:'', link: ' ',
         description: '', ings: '', directions: '',
         imgsrc:'http://i.imgur.com/SyZyVmN.jpg', activePage: 1, 
         tags: []};
    },
    handleTitleChange: function(e){
      this.setState({title: e.target.value});
  	},    
    handlePanelSelect(activeKey) {
    	this.setState({ activeKey });
  	},   
  	changeImgSrc: function(e) {
      this.setState({imgsrc: e.target.value});
  	},
  	handleDescChange: function(e) {
	  this.setState({description: e.target.value});
	},
	handleLinkChange: function(e) {
	  this.setState({link: e.target.value});
	},
	onIngredientsChange: function(e) {
      this.setState({ings: e.target.value});
    },
    onDirectionsChange: function(e) {
      this.setState({directions: e.target.value});
    },
    handleRatingSelect: function(e, sel) {
      this.setState({
        activePage: sel.eventKey
      });
    },
    handleDelete: function(i) {
        var tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    },
    handleAddition: function(tag) {
        var tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    },
    handleDrag: function(tag, currPos, newPos) {
        var tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: tags });
    },
	handlePostSubmit: function() {
	  if(this.state.activeKey == 1){
	    handleLinkSubmit();
	  }
	  else {
	    handlePostSubmit();
	  }
	}, 
	handleLinkSubmit: function() {
		var link = this.state.link.trim();
		var data = {
		  accessToken: fbAccessToken,
		  recipeLink: this.state.link,
		  recipeTitle: this.state.title,
		  imageLink: this.state.imgsrc.trim(),
		  recipeDescription: this.state.description,
		  recipeRating: this.state.activePage,
		  userId: fbUserID
		};
		var url = 'http://localhost:3000/api/posts/';
		jQuery.ajax({
		  url: url,
		  dataType: 'json',
		  type: 'POST',
		  data: data,
		  success: function(data) {
		    console.log("Successfully added recipe to db")
		  }.bind(this),
		  error: function(xhr, status, err) {
		    console.error(url, status, err.toString());
		  }.bind(this)
		});
	  },
	handlePostSubmit: function() {
		var data = {
		  accessToken: fbAccessToken,
		  ingredients: this.state.ings,
		  recipeTitle: this.state.title,
		  directions: this.state.directions.trim(),
		  imageLink: this.state.imgsrc.trim(),
		  recipeDescription: this.state.description,
		  recipeRating: this.state.activePage,
		  userId: fbUserID
		};
		var url = 'http://localhost:3000/api/posts/';
		console.log("data : " + data.toString());
		jQuery.ajax({
		  url: url,
		  dataType: 'json',
		  type: 'POST',
		  data: data,
		  success: function(data) {
		    console.log("Successfully added recipe to db");
		  }.bind(this),
		  error: function(xhr, status, err) {
		    console.error(url, status, err.toString());
		  }.bind(this)
		});
	  },
    render: function() {
        return (  
        <div>
          <form onSubmit={this.handleSubmit}>
	        <Input
			  type="text"
			  label="Title"
			  placeholder="Mom's Spaghetti"
			  labelClassName="col-xs-2"
			  wrapperClassName="col-xs-15"
			  bsStyle={this.state.title.length > 0 ? 'success' : 'error'}
			  value={this.state.title}
			  onChange={this.handleTitleChange}
			/>
			<img src={this.state.imgsrc} alt="Add a picture!"
	           height='200px' width='200px' className="img-responsive"/>
			  <Input
			    type="text"
			    label="Image URL"
			    labelClassName="col-xs-2"
			    wrapperClassName="col-xs-15"
			    onChange={this.changeImgSrc}
			    value={this.state.imgsrc}
			  />
			<PanelGroup activeKey={this.state.activeKey} onSelect={this.handlePanelSelect} accordion>
			    <Panel eventKey="1" header="Link to Recipe">
			    	<RecipeLinkForm handleLinkChange={this.handleLinkChange} />
		    	</Panel>
			    <Panel eventKey="2" header="Post the Recipe Yourself">
			    	<RecipeCustomForm onDirectionsChange={this.onDirectionsChange}
			    	                  onIngredientsChange={this.onIngredientsChange}/>
		    	</Panel>
		    </PanelGroup>
		    <Input
			  type="textarea"
			  label="Add a Description"
			  labelClassName="col-xs-2"
			  wrapperClassName="col-xs-15"
			  value={this.state.description}
			  onChange={this.handleDescChange}
			/>
			<h3>Rating:</h3>
			<Pagination
		      bsSize="large"
		      items={5}
		      activePage={this.state.activePage}
		      onSelect={this.handleRatingSelect} />
			<ButtonInput type="submit" value="Post" bsStyle="success" bsSize="large" />
		   </form>
        </div>);
    }
});

var RecipeCustomForm = React.createClass({
  getInitialState: function() {
    return {ings: '', directions: ''};
  },
  onIngredientsChange: function(e) {
   this.setState({ings: e.target.value});
   this.props.onIngredientsChange(e.target.value);
  },
  onDirectionsChange: function(e) {
    this.setState({directions: e.target.value});
    this.props.onDirectionsChange(e);
  },
  render: function () {
    return (
      <div>
      <Input
        type="textarea"
        label="Ingredients"
        labelClassName="col-xs-2"
        wrapperClassName="col-xs-15"
        onChange={this.onIngredientsChange}
        value={this.state.ings}
      />
      <Input
        type="textarea"
        label="Directions"
        labelClassName="col-xs-2"
        wrapperClassName="col-xs-15"
        onChange={this.onDirectionsChange}
        value={this.state.directions}
      />
      </div>
    );
  }
});

var RecipeLinkForm = React.createClass({
  getInitialState: function() {
    return {link: ''};
  },
  handleLinkChange: function(e) {
    this.setState({link: e.target.value});
    this.props.handleLinkChange(e);
  },
  render: function () {
    return (
        <Input
          type="text"
          label="Link"
          placeholder="http://allrecipes.com/..."
          labelClassName="col-xs-2"
          wrapperClassName="col-xs-15"
          bsStyle={this.state.link.length > 0 ? 'success' : 'error'}
          value={this.state.link}
          onChange={this.handleLinkChange}
        />
    );
  }
});

ReactDOM.render(<PostRecipe />, content);
