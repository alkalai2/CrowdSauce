
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
    Button = ReactBootstrap.Button

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

var Ingredients = React.createClass({
    render: function() {
        return (
          <Table responsive>
            <thead>
              <tr>
                <th>Ingredients</th>
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
    return (
      <Image className = "recipeImage" src={this.props.src} rounded />
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

  render: function() {
    if(!this.state.tags) {
      return <span></span>
    } else {
      return (
        <span>
        {this.state.tags.map(function(tag) {
          return <span className="tag label label-info">{tag}</span>
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
      return <CustomRecipe ingredients={this.props.data.ingredients}
            directions={this.props.data.directions}/>
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
          <ImageThumbnail src={this.state.currentImages[0]}/>
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
              <Tags className = "tagset" postId={this.props.data.postId}/>
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
          <ImageThumbnail src={this.props.data.images[0]}/>
          <div>
            <blockquote className = "recipe-notes">
              {this.state.notes}
            </blockquote>
          </div>
            {recipe}

          <div className = "post-footer">
            <div>
              <Tags className = "tagset" postId={this.props.data.postId}/>
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
    var editable=this.props.editable
    var addNames=this.props.addNames
    
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
                  profileNavigation={profileNavigation}/>
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







