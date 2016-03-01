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
var data = {

  "userId" : 123456, 
  "title" : "Spicy Chicken Enchiladas",
  "ingredients": ["ingredient 1",  "ingredient 2",  "ingredient 3"],
  "directions" : ["mix two eggs", "fry bacon", "toast bread"], 
  "recipeLink" : "http://iamafoodblog.com/ivan-ramen-toasted-rye-ramen-noodles/",
  "imageLink" : "http://i.imgur.com/SyZyVmN.jpg", 
  "tags" : ["chicken", "dinner", "spicy", "orange"],
  "notes": "This was everything I wanted. Nice texture to the chicken with the high stove heat, and the added spices really gave it a nice kick. I would recommend using cayenne to taste for those that like it less hot! Delicious! Okay!",
  "rating": 4,
  "timestamp": "Feb 24, 2016"
}

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
    var stars = [];
    for(var i = 0; i < this.props.rating; i++) {
      stars.push(<img src={"img/plain-star.png"} className="rating-star"/>)
    }
    return (
      <span className = "rating-stars">
      {stars}
      </span>
    );
  }
});

var Tags = React.createClass ({
  render: function() {
    return (
      <span>
      {this.props.items.map(function(item) {
        return <span className="tag label label-info">{item}</span>
      })}
      </span>
    );
  }
});

var FavoriteStar = React.createClass ({
  getInitialState: function() {
    return {favorited: false};
  },

  // toggle state
  handleClick: function() {
    this.setState({favorited: !this.state.favorited});
  }, 

  render: function() {
    var image_src = this.state.favorited ? "img/heart-empty.png" : "img/heart-filled.png";
    var tooltip_txt = this.state.favorited ? "Add to Favorites" : "Favorited";
    var tooltip = <Tooltip>{tooltip_txt}</Tooltip>;

    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
      <img src={image_src} 
        className="favorite-heart" 
        onClick = {this.handleClick}/>
      </OverlayTrigger>
    );
  }
});

var Post = React.createClass({

  render : function() {
    return (
      <Panel>
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
        <CustomRecipe 
          ingredients={this.props.data.ingredients}
          directions={this.props.data.directions}/>
        <div className = "post-footer">
          <Tags className = "tagset" items={this.props.data.tags}/>
          <FavoriteStar />
        </div>
      </Panel>
    );
  },
});


// add rendered post to element with id = 'posts'
ReactDOM.render(<Post data = {data}/>, posts);





