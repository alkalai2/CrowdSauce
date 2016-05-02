
/**
 * @jsx React.DOM
 */

/*
 * React class to render a complete Post 
 * uses a JSON spec to populate Post components
 * also relies on public/css/posts.css for formatting 
 */

var Input = ReactBootstrap.Input,
    Panel = ReactBootstrap.Panel,
    Table = ReactBootstrap.Table,
    PanelGroup = ReactBootstrap.PanelGroup,
    Image = ReactBootstrap.Image,
    Tooltip = ReactBootstrap.Tooltip,  
    OverlayTrigger = ReactBootstrap.OverlayTrigger,
    Modal = ReactBootstrap.Modal,
    ButtonToolbar = ReactBootstrap.ButtonToolbar,
    Button = ReactBootstrap.Button,
    Carousel = ReactBootstrap.Carousel,
    CarouselItem = ReactBootstrap.CarouselItem

// Example of data that we will get from API
// will be used to display a post on the site
// var data = {

//   "userId" : 123456, 
//   "title" : "Spicy Chicken Enchiladas",
//   "ingredients": ["ingredient 1",  "ingredient 2",  "ingredient 3"],
//   "directions" : ["mix two eggs", "fry bacon", "toast bread"], 
//   "recipeLink" : "http://iamafoodblog.com/ivan-ramen-toasted-rye-ramen-noodles/",
//   "images" : ["http://i.imgur.com/SyZyVmN.jpg"],
//   "tags" : ["chicken", "dinner", "spicy", "orange"],
//   "notes": "This was everything I wanted. Nice texture to the chicken with the high stove heat, and the added spices really gave it a nice kick. I would recommend using cayenne to taste for those that like it less hot! Delicious! Okay!",
//   "rating": 4,
//   "timestamp": "Feb 24, 2016"
// }

// Handles the hover over each ingredient and allows for self addition 
// or deletion from the shopping list.  Makes its own calls.
var SingleIngredient = React.createClass({
  getInitialState : function() {
    return {added: false, hover: false}
  },

  onShoppingClick: function() {
    // if adding to list, make server call
    var url = 'http://localhost:3000/api/shoppinglist/items'
    jQuery.ajax({
      url:  url,
      type: 'POST',
      headers: {
        'accessToken': fbAccessToken,
        'userId': fbUserID
      },
      dataType: 'json',
      data: {
        'ingredients': [this.props.ingrName]
      },
      success: function(data) {
        this.setState({added: !this.state.added})
        this.forceUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
      }.bind(this)
    });
    
  },
  // Interaction with mouse events.  Just update state and let
  // render deal with the rest
  mouseOver: function () {
      this.setState({hover: true});
  }, 
  mouseOut: function () {
      this.setState({hover: false});
  },
  // If not already added to shopping list, render add button, otherwise, render Added .png
  render: function() {
    var style = this.state.hover ? {visibility: 'inherit'} : {visibility: 'hidden'}
    button = this.state.added ? 
      <span className="tag label label-success ingr-image-holder"><img className="ingr-ok-icon" src="img/glyphicons/png/glyphicons-207-ok.png"></img></span>:
      <Button style={style} className="ingr-button" bsSize="xsmall" onClick={this.onShoppingClick}>add to shopping list</Button>
      return (
          <td onMouseEnter={this.mouseOver} onMouseLeave={this.mouseOut}><span>{this.props.ingrName} {button} </span> </td>
      );
  }
});

// Simple thread/list of ingredients
var Ingredients = React.createClass({
    // add shopping list buttons
    render: function() {
        return (
          <Table responsive>
            <thead>
              <tr>
                <th>Ingredients</th>
              </tr>
            </thead>

            <tbody>
              {(this.props.items).map(function(ingrName) {
                 return <tr><SingleIngredient ingrName={ingrName}/> </tr>
              })}
            </tbody>
          </Table>
        );
    },
});

// Simple thread of Directions to be rendered.
var Directions = React.createClass({
    render: function() {
        return (
          <Table striped condensed responsive>
            <thead>
              <tr>
                <th>Directions</th>
              </tr>
            </thead>

            <tbody>
              {(this.props.items).map(function(i) {
                 return <tr><td>{i}</td> </tr>
              })}
            </tbody>

          </Table>
        );
    },
});

// combines Ingredients + Directions
var CustomRecipe = React.createClass({
  render: function() {
    return (
      <PanelGroup defaultActiveKey="2" accordion>
        <Panel header="See Recipe" eventKey="1">
          <Ingredients items={this.props.ingredients}/>
          <Directions items={this.props.directions}/>
        </Panel>
      </PanelGroup>
    );
  }
});

// A custom React component that renders 
var RecipeLink = React.createClass({
  getInitialState: function() {
    return {
      showModal: false
    };
  }, 
  openModal: function() {
    this.setState({showModal: true})
  },
  closeModal: function() {
    this.setState({showModal: false})
  }, 
  navigateToPage: function() {
    var win = window.open(this.props.url, '_blank');
    win.focus();
  },
  // Renders modal of link webpage as a preview of the 
  // link
  render: function() {
    var Iframe = 'Iframe'
    var url = this.props.url

    return (
      <div>
        <Panel className="recipe-link">
          <a onClick={this.openModal}>{url}</a>
        </Panel>
        <Modal className="recipe-link-modal" show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Body>
            <div>
              <Iframe className="recipe-iframe" src={url}/>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
});


// Renders a carousel of images in the middle of the post
// that represents the user's experience of making this 
// recipe.
var ImageThumbnail = React.createClass({
  render: function() {
    imageLinks = this.props.imageLinks
	// If there is only one image, just display it with an Image
	// otherwise go through the trouble of creating a Carousel map 
	// the render function over the imageLinks property.
    if (imageLinks.length == 1) {
      return <Image className = "recipeImage" src={imageLinks[0]} rounded />
    }
    return (
      <Carousel className="carousel-full">
        {imageLinks.map(function(image) {
            return (
              <CarouselItem>
                <Image className = "recipeImage" src={image} rounded />
              </CarouselItem>
            );
        })}
      </Carousel>
    );
  }
});

// A class that shows rating stars in the top right corner of the 
// post.
var RatingStars = React.createClass ({
  render: function() {
    var stars;
    var rating = this.props.rating;
    // Parses the rating value and renders correct number of stars.
    if(rating===1) 
      stars = (<img src={"img/1star.png"} className="rating-star"/>)
    if(rating===2) 
      stars = (<img src={"img/2stars.png"} className="rating-star"/>)
    if(rating===3) 
      stars = (<img src={"img/3stars.png"} className="rating-star"/>)
    if(rating===4) 
      stars = (<img src={"img/4stars.png"} className="rating-star"/>)  
    if(rating===5) 
      stars = (<img src={"img/5stars.png"} className="rating-star"/>)
	// Mostly a CSS based solution in terms of rendering.
    return (
      <span className = "rating-stars"> {stars} </span>
    );
  }
});

var Tags = React.createClass ({
  getInitialState: function() {
    return {tags: []}
  },

  componentDidMount: function() {
    this.loadTagsFromServer()
  },
  // Again, different method from post retreival for 
  // tag retreival
  loadTagsFromServer: function() {
    var url = 'http://localhost:3000/api/tags/post'
    jQuery.ajax({
      url:  url,
      type: 'GET',
      headers: {
        'accessToken': fbAccessToken,
        'userId': fbUserID
      },
      dataType: 'json',
      data: {
        'postId': this.props.postId
      },
      // Upon success, add to the tags string
      success: function(data) {
        var tags = this.state.tags
        for(d in data) {
          tagName = data[d]['tagName']
          if(tagName) {
            tags = tags.concat(tagName)
          }
        }
        this.setState({tags: tags})
      }.bind(this),
      error: function(xhr, status, err) {
      }.bind(this)
    });
  },

	// When a tag is clicked, it should put the text of the tag
	// in the search bar and search automatically.
  hangleClick : function(e) {
    tagName = e.target.text
    
    if (this.props.handleSearch) {
      this.props.handleSearch(tagName)
    }
  },
  // Tags are just a smal list of horizontal blue boxes in the bottom
  // left corner
  render: function() {
    var self = this
    if(!this.state.tags) {
      return <span></span>
    } else {
      return (
        <span>
        {this.state.tags.map(function(tag) {
          return <span className="tag label label-info"><a className="tag-link" onClick={self.hangleClick}>{tag}</a></span>
        })}
        </span>
      );
    } 
  }
});

// A Component that transforms a post into an editable post by
// converting all controls in the text fields.
var EditButtons = React.createClass({
  render: function() {
    toDisplay = 
      <button 
        className="btn btn-primary btn-xs edit-buttons" 
        type="button" 
        onClick={this.props.startEditing}> Edit </button>;
	// When in edit mode, all the controls are essentially editable text 
	// fields.
    if(this.props.editing) {
      toDisplay = 
        <span> 
          <button className="btn btn-default btn-xs edit-buttons" 
            type="button" 
            onClick={this.props.cancelEditing}> Cancel </button>

          <button 
            className="btn btn-primary btn-xs edit-buttons" 
            type="button" 
            onClick={this.props.saveEditions}> Save </button>
        </span>;
    }

    return (
      <span>
          {toDisplay}
      </span>
    ) 
  }  
})

// Same deal as tags but with favorites.  Different endpoint
// same code.
var FavoriteStar = React.createClass ({
  getInitialState: function() {
    return {favorited: false};
  },

  componentDidMount: function() {
    this.getFavorites();
  },

  getFavorites: function() {
    var headers = {
      Accept: 'text/html',
      accessToken: fbAccessToken,
      userId: fbUserID
    }
    jQuery.ajax({
      url: 'http://localhost:3000/api/favorites/user/',
      type: 'GET',
      headers: headers,
      dataType: 'json',
      timeout : 10000,
      success: function(data) {
        this.checkFavorites(data);
      }.bind(this),
      error: function(xhr, status, err) {
      }.bind(this)
    }); 
  },

  checkFavorites: function(data) {
    for(d in data) {
      postId = data[d]['postId'];
      if(postId === this.props.data.postId) {
          this.setState({favorited: true});
      }
    }
  },


  addFavorite: function() {
    this.setState({favorited: true});
    var headers = {
      accessToken: fbAccessToken,
      userId: fbUserID
    }
    var data = this.props.data
    var url = 'http://localhost:3000/api/favorites/';
    jQuery.ajax({
      url:  url,
      type: 'POST',
      headers: headers,
      dataType: 'json',
      data: data,
      success: function(data) {
        console.log("successfully favorited");
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.source, status, err.toString());
      }.bind(this)
    }); 
  },

  removeFavorite: function() {
    this.setState({favorited: false});
    var headers = {
      accessToken: fbAccessToken,
      userId: fbUserID
    }
    var data = this.props.data
    var url = 'http://localhost:3000/api/favorites/';
    jQuery.ajax({
      url:  url,
      type: 'DELETE',
      headers: headers,
      dataType: 'json',
      data:data,
      success: function(data) {
      }.bind(this),
      error: function(xhr, status, err) {
      }.bind(this)
    }); 
  },
  // toggle state
  handleClick: function() {
    this.state.favorited ? this.removeFavorite() : this.addFavorite();
  }, 

  render: function() {
    var image_src = this.state.favorited ? "img/heart-filled.png" : "img/heart-empty.png";
    var tooltip_txt = this.state.favorited ? "Favorited" : "Add to Favorites";
    var tooltip = <Tooltip>{tooltip_txt}</Tooltip>;
    return (
      <div className="favorite-div">
      <OverlayTrigger placement="top" overlay={tooltip} delay={.3} trigger={['hover']}>
      <img src={image_src} 
        className="favorite-heart" 
        onClick = {this.handleClick}/>
      </OverlayTrigger>
      </div>

    );
  }
});

// A stand in for new users or users with no friends that we show
// if there were no posts to show.
var NoPostsDisplay = React.createClass({
  render: function() {
     return <span className="no-posts-display"> 
        <div>
          <br></br>
          <img src={"img/spilled_cup.png"} className="no-posts-image"/>
        </div>
        <div>
          <center><i>{this.props.errorMsg}</i></center>
        </div>
      </span>
  }
})

// The post class combines all above controls into one cohesive
// editable, favoritable, post.
var Post = React.createClass({
  getInitialState: function() {
    return {
  		editing: false,
  		title: this.props.data.title,
  		notes: this.props.data.notes,
        images : this.props.data.images,
  		currenttitle: this.props.data.title,
  		currentnotes: this.props.data.notes,
      currentImages: this.props.data.images
  	}
  },
  //called when postlist reacts to changes in its data
  //sets state values to new properties
  componentWillReceiveProps: function(nextProps){
    if(nextProps){
      this.setState({
        title: nextProps.data.title,
        notes: nextProps.data.notes,
        images: nextProps.data.images,
        currenttitle: nextProps.data.title,
        currentnotes: nextProps.data.notes,
        currentImages: nextProps.data.images
      });}
   },
  // Callbacks to handle Post editing.
  handleTitleChange: function(event) {
    this.setState({currenttitle: event.target.value});
  },
  handleNotesChange: function(event) {
    this.setState({currentnotes: event.target.value});
  },
  handleImagesChange: function(event) {
    this.setState({currentimages: event.target.value});
  },  
  // Same but to start or stop editing.
  startEditing: function() {
    this.setState({editing: true})
    this.forceUpdate();
  },
  cancelEditing: function() {
    this.setState({editing: false})
    this.forceUpdate();
  },
  // This is a function that first saves all data and then sends it to the 
  // backend API
  saveEditions: function() {
    // check that we actually need to update
    if (this.state.currenttitle != this.state.title || 
        this.state.currentnotes != this.state.notes ||
        this.state.currentimages != this.state.images
      ) {

      newTitle  = this.state.currenttitle
      newNotes  = this.state.currentnotes
      newImages = this.state.currentImages

      newData = {}
      newData['title'] = newTitle
      newData['notes'] = newNotes
      newData['postId'] = this.props.data.postId
      newData['images'] = newImages

      // submit changes to API
      jQuery.ajax({
        url: 'http://localhost:3000/api/posts/',
        type: 'PUT',
        headers: {
          'accessToken': fbAccessToken,
          'userId': fbUserID
        },
        data: newData,
        dataType: 'json',
        timeout : 10000,
        success: function(data) {
        }.bind(this),
        error: function(xhr, status, err) {
        }.bind(this)
      });

      // set post states to display change immediately
      this.setState({title: newTitle})
      this.setState({notes: newNotes})
      this.setState({images: newImages})
    } 
	// Refresh the UI to update and show new 
	// changes.
    this.setState({editing: false})
    this.forceUpdate();
  },

  checkForLink: function(editing){
    if(this.props.data.ingredients.length === 0){
      return <RecipeLink url={this.props.data.recipeLink} />
    } else {
      return <CustomRecipe ingredients={this.props.data.ingredients}
            directions={this.props.data.directions}/>
    }
  },

  deletePost: function(){
     this.setState({editing: false})
    var postIdToDelete = this.props.data.postId;
    this.props.handleDeletion(postIdToDelete);
  },

  render : function() {
    var recipe = this.checkForLink(this.state.editing);
    var favoriteHeart = !this.props.favoriteAble ? "" : <FavoriteStar data={this.props.data} />;
    var editable = this.props.editable ? 
      <EditButtons 
        startEditing={this.startEditing}
        cancelEditing={this.cancelEditing}
        saveEditions={this.saveEditions}
        editing={this.state.editing}/> 
      : "";
    var addNames = (this.props.addNames && this.props.data.name) ?
        <span>
          <ProfileLink 
            profileNavigation={this.props.profileNavigation}
            userId={this.props.data.userId}
            userName={this.props.data.name}/> 
           posted a new recipe
        </span>
      : <span> &nbsp; </span>;

    // wholly different rendering to be done if 
    // in a state of editing.
	if (this.state.editing) {
	// All the components of a post but in editable mode.  Mostly
	// this means transforming everything into an editable version of 
	// the current bootstrap component.
		return(
      <div className="post-full">
        <Panel className="post-panel">
          <div> 
            <span> 
              {addNames}
              {editable}
            </span>
            <hr></hr>   
            <Input
              className="edit-title"
              type="text"
              wrapperClassName="col-xs-7 "
              label="Title"
              labelClassName="col-xs-12 edit-title-label"
              value={this.state.currenttitle}
              onChange={this.handleTitleChange}/>
          </div>
          <ImageThumbnail imageLinks={this.state.currentImages}/>
          <Input
            className="edit-image-link"
            type="text"
            wrapperClassName="col-xs-8 col-sm-offset-2"
            label="Image Source"
            labelClassName="col-xs-8 col-sm-offset-2"
            onChange={this.handleImagesChange}
            value={this.state.currentImages[0]}/>
          <div>
            <Input
              className="edit-notes"
              type="text"
              label="Notes"
              labelClassName="col-xs-12 edit-notes-label"

              value={this.state.currentnotes}
              onChange={this.handleNotesChange}/>
          </div>
            {recipe}

          <div className = "post-footer">
            <div>
              <Tags className = "tagset" handleSearch={this.props.handleSearch} postId={this.props.data.postId}/>
              {favoriteHeart}
            </div>
            <div>
                <Button className="delete-button" bsSize="small" onClick={this.deletePost}>Delete Post</Button>
            </div>
            <Comment id={this.props.data.postId}/>
          </div>
        </Panel>
      </div>
		);
	}
	else {
	// Puts the prep time and difficulty below the image and then 
	// recipe experience notes underneath.
	// First the Ratings stars in the top right and then the post 
    // title to the left of that.  
    // The formatting we want is best represented by the block quote
    // Finally, At the bottom of the post, put the tags
	return (
      <div className="post-full">
        <Panel className="post-panel">
          <div> 
            <span> 
              {addNames}
              {editable}
            </span>
           
            <RatingStars rating={this.props.data.rating}/>
            <hr></hr>   
            <h3 className = "post-title">
              {this.state.title}
            </h3>
          </div>
          <ImageThumbnail imageLinks={this.props.data.images}/>
          <div className="prep-difficulty">
            <span className="prepTime"> <i> prep time: </i>{this.props.data.prepTime}</span>
            <span className="difficulty"> <i> difficulty: </i> {this.props.data.difficulty}</span>
          </div>
          <div>
            <blockquote className = "recipe-notes">
              {this.state.notes}
            </blockquote>
          </div>
            {recipe}
          <div className = "post-footer">
            <div>
              <Tags className = "tagset" handleSearch={this.props.handleSearch} postId={this.props.data.postId}/>
              {favoriteHeart}
            </div>
            <Comment id={this.props.data.postId}/>
          </div>
        </Panel>
      </div>
    );
	
	}
  },
});

// The final parent class of all above controls that finally
// renders all posts as a list of posts as a feed/profile/whatver
var PostList = React.createClass({
  getInitialState : function() {
    return { data : []};
  },

  //deletion of a post, carried out by calling the API and updating local state
   handlePostDeletion : function(postId) {
      var postIdToDelete = postId;
      console.log("goop" + postIdToDelete);
      var url = 'http://localhost:3000/api/posts'
      jQuery.ajax({
        url:  url,
        type: 'DELETE',
        headers: {
          'accessToken': fbAccessToken,
          'userId': fbUserID
        },
        dataType: 'json',
        data: {
          'postId': postIdToDelete
        },
        success: function(data) {
          console.log("removing " + postIdToDelete + " from post list")
          data = this.state.data.filter(function(e){return e.postId!==postIdToDelete})
          console.log(this.state.data)
          this.setState({data: data},function(){console.log(this.state.data)});
          this.forceUpdate()
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(status, err.toString());
        }.bind(this)
      });
    },

    //needed because data comes in late due to server loading time
   componentWillReceiveProps: function(nextProps){
      this.setState({data:nextProps.data});
   },

  render: function() {
    var favoriteAble = this.props.favoriteAble
    var profileNavigation=this.props.profileNavigation
    var handleSearch=this.props.handleSearch
    var editable=this.props.editable
    var addNames=this.props.addNames
    var self = this
    // if no posts, display a 'no posts image'
    var toDisplay = <NoPostsDisplay errorMsg={this.props.errorMsg}/>
    // add search bar 
    if (this.state.data && this.state.data.length > 0) {
      toDisplay = 
        <div>
          {
            (this.state.data).map(function(post_data) {
             return (
                <Post 
                  data={post_data} 
                  favoriteAble={favoriteAble}
                  editable={editable}
                  addNames={addNames}
                  handleSearch={handleSearch}
                  profileNavigation={profileNavigation}
                  handleDeletion={self.handlePostDeletion}/>
              )
            })
          }
        </div>
    }
	// The full feed in one component
    return (
      <div className="post-list"> 
        {toDisplay}
      </div>
    )
  }
})

