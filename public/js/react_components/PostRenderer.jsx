
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
    OverlayTrigger = ReactBootstrap.OverlayTrigger




// Example data to simulate what we will get from API
// will be used to display a post on the site
// var data = {

//   "userId" : 123456, 
//   "title" : "Spicy Chicken Enchiladas",
//   "ingredients": ["ingredient 1",  "ingredient 2",  "ingredient 3"],
//   "directions" : ["mix two eggs", "fry bacon", "toast bread"], 
//   "recipeLink" : "http://iamafoodblog.com/ivan-ramen-toasted-rye-ramen-noodles/",
//   "imageLink" : "http://i.imgur.com/SyZyVmN.jpg", 
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
  navigateToPage: function() {
    var win = window.open(this.props.url, '_blank');
    win.focus();
  },

  render: function() {
    return (
      <Panel className="recipe-link">
        <a onClick={this.navigateToPage}>{this.props.url}</a>
      </Panel>
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
  render: function() {
    if(!this.props.items) {
      return <span></span>
    } else {
      return (
        <span>
        {this.props.items.map(function(item) {
          return <span className="tag label label-info">{item}</span>
        })}
        </span>
      );
    } 
  }
});

var FavoriteStar = React.createClass ({
  getInitialState: function() {
    return {favorited: false};
  },


  addFavorite: function() {
    console.log("favoriting post..."); 
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
    var headers = {
      accessToken: fbAccessToken,
      userId: fbUserID
    }
    var data = {
      postId: this.props.id
    }
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
    this.setState({favorited: !this.state.favorited});
    if(this.state.favorited) {
      this.removeFavorite();
    }
    if(!this.state.favorited) {
      this.addFavorite();
    }

  }, 

  render: function() {
    var image_src = this.state.favorited ? "img/heart-filled.png" : "img/heart-empty.png";
    var tooltip_txt = this.state.favorited ? "Add to Favorites" : "Favorited";
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

  checkForLink: function(){
    if(this.props.data.ingredients.length === 0){
      return <RecipeLink url={this.props.data.recipeLink} />
    } else {
      return <CustomRecipe ingredients={this.props.data.ingredients}
            directions={this.props.data.directions}/>
    }
  },
  render : function() {
    var favoriteHeart = !this.props.favoriteAble ? "" : <FavoriteStar data={this.props.data} />;
    var recipe = this.checkForLink();
    return (
      <div className="post-full">
        <Panel className="post-panel">
          <div> 
            <b>Jonathan</b> posted a new recipe
            <RatingStars rating={this.props.data.rating}/>
            <hr></hr>   
            <h3 className = "post-title">
              {this.props.data.title}
            </h3>
          </div>
          <ImageThumbnail src={this.props.data.imageLink}/>
          <div>
            <blockquote className = "recipe-notes">
              {this.props.data.notes}
            </blockquote>
          </div>
            {recipe}

          <div className = "post-footer">
            <div>
              <Tags className = "tagset" items={this.props.data.tags}/>
              {favoriteHeart}
            </div>
            <Comment id={this.props.data.id}/>
          </div>
        </Panel>
      </div>
    );
  },
});

var PostList = React.createClass({
  render: function() {
    var favoriteAble = this.props.favoriteAble
    
    // if no posts, display a 'no posts image'
    var toDisplay = <NoPostsDisplay errorMsg={this.props.errorMsg}/>

    if (this.props.data && this.props.data.length > 0) {
      toDisplay = 
        (this.props.data).map(function(post_data) {
           return <Post data={post_data} favoriteAble={favoriteAble}/>
        })
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







