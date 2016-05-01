
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

// Example data to simulate what we will get from API
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
        console.log("added " + this.props.ingrName + " to shopping list")
        if(this.props.shoppingtListAddition) {
          this.props.shoppingtListAddition(this.props.ingrName)
          console.log("shopping list should re-render")
        }
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
      <Button style={style} className="ingr-button" bsSize="xsmall" onClick={this.onShoppingClick}>add to shopping list</Button>

      return (
          <td onMouseEnter={this.mouseOver} onMouseLeave={this.mouseOut}><span>{this.props.ingrName} {button} </span> </td>
      );
  }
});

var Ingredients = React.createClass({
    // add shopping list buttons

    render: function() {
        var self = this
        return (
          <Table responsive>
            <thead>
              <tr>
                <th>Ingredients</th>
              </tr>
            </thead>

            <tbody>
              {(this.props.items).map(function(ingrName) {
                 return <tr><SingleIngredient shoppingtListAddition={self.props.shoppingtListAddition} ingrName={ingrName}/> </tr>
              })}
            </tbody>
          </Table>
        );
    },
});

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
          <Ingredients shoppingtListAddition={this.props.shoppingtListAddition} items={this.props.ingredients}/>
          <Directions items={this.props.directions}/>
        </Panel>
      </PanelGroup>
    );
  }
});


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



var ImageThumbnail = React.createClass({

  render: function() {
    imageLinks = this.props.imageLinks

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

var RatingStars = React.createClass ({
  render: function() {
    var stars;
    var rating = this.props.rating;
    
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

    return (
      <span className = "rating-stars">
      {stars}
      </span>
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

  loadTagsFromServer: function() {
    console.log('getting tags for ' + this.props.postId)
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
        console.error(this.props.source, status, err.toString());
      }.bind(this)
    });
  },

  hangleClick : function(e) {
    tagName = e.target.text
    
    if (this.props.handleSearch) {
      console.log("Tag click. Navigating to posts with " + tagName)
      this.props.handleSearch(tagName)
    }
  },

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

var EditButtons = React.createClass({

  render: function() {
    toDisplay = 
      <button 
        className="btn btn-primary btn-xs edit-buttons" 
        type="button" 
        onClick={this.props.startEditing}> Edit </button>;

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

var FavoriteStar = React.createClass ({
  getInitialState: function() {
    return {favorited: false};
  },


  componentDidMount: function() {
    this.getFavorites();
  },

  getFavorites: function() {
    console.log("getting favorites from server..."); 
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
        console.log(data);
        this.checkFavorites(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("ERROR GET FAVORITES")
        console.error(this.props.source, status, err.toString());
      }.bind(this)
    }); 
  },

  checkFavorites: function(data) {
    for(d in data) {
      postId = data[d]['postId'];
      console.log("this's data")
      console.log(this.props.data);
      console.log("this's postid")
      console.log(this.props.data.postId);
      if(postId === this.props.data.postId) {
          this.setState({favorited: true});
      }
    }
  },


  addFavorite: function() {
    console.log("favoriting post..."); 
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
    console.log("unfavoriting post..."); 
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
        console.log("successfully unfavorited")
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.source, status, err.toString());
      }.bind(this)
    }); 
  },
  // toggle state
  handleClick: function() {
    //this.setState({favorited: !this.state.favorited});
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
  
  handleTitleChange: function(event) {
    this.setState({currenttitle: event.target.value});
  },
  
  handleNotesChange: function(event) {
    this.setState({currentnotes: event.target.value});
  },

  handleImagesChange: function(event) {
    this.setState({currentimages: event.target.value});
  },  

  startEditing: function() {
    this.setState({editing: true})
    this.forceUpdate();
  },

  cancelEditing: function() {
    this.setState({editing: false})
    this.forceUpdate();
  },

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
          console.log("updated post " + this.props.data.postId)
          console.log(data);
        }.bind(this),
        error: function(xhr, status, err) {
           console.log("failed updating post " + this.props.data.postId)
          console.error(this.props.source, status, err.toString());
        }.bind(this)
      });

      // set post states to display change immediately
      this.setState({title: newTitle})
      this.setState({notes: newNotes})
      this.setState({images: newImages})
    } else {
      console.log("Nothing to save. No updating needed")
    }

    this.setState({editing: false})
    this.forceUpdate();
  },

  checkForLink: function(editing){
    if(this.props.data.ingredients.length === 0){
      return <RecipeLink url={this.props.data.recipeLink} />
    } else {
      return <CustomRecipe 
                ingredients={this.props.data.ingredients}
                directions={this.props.data.directions}
                shoppingtListAddition={this.props.shoppingtListAddition}/>
    }
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
    var addNames = this.props.addNames ?
        <span>
          <ProfileLink 
            profileNavigation={this.props.profileNavigation}
            userId={this.props.data.userId}
            userName={this.props.data.name}/> 
           posted a new recipe
        </span>
      : <span> &nbsp; </span>;

    
	if (this.state.editing) {
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
            <Comment id={this.props.data.postId}/>
          </div>
        </Panel>
      </div>		
		
		
		);
	
	}
	else {
	
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

var PostList = React.createClass({
  render: function() {
    var favoriteAble = this.props.favoriteAble
    var profileNavigation=this.props.profileNavigation
    var handleSearch=this.props.handleSearch
    var editable=this.props.editable
    var addNames=this.props.addNames
    var shoppingtListAddition=this.props.shoppingtListAddition

    
    // if no posts, display a 'no posts image'
    var toDisplay = <NoPostsDisplay errorMsg={this.props.errorMsg}/>

    // add search bar 
    // var searchBar = this.props.searchBar ? 
    //   <SearchBar handleSearch={this.props.handleSearch}/> : ""

    if (this.props.data && this.props.data.length > 0) {
      toDisplay = 
        <div>
          <div>
            
          </div>
          {
            (this.props.data).map(function(post_data) {
             return (
                <Post 
                  data={post_data} 
                  favoriteAble={favoriteAble}
                  editable={editable}
                  addNames={addNames}
                  handleSearch={handleSearch}
                  profileNavigation={profileNavigation}
                  shoppingtListAddition={shoppingtListAddition}/>
              )
            })
          }
        </div>
    }

    return (
      <div className="post-list"> 
        {toDisplay}
      </div>
    )
  }
})


// add rendered post to element with id = 'posts'
//ReactDOM.render(<Post data = {data}/>, posts);







