

var About = React.createClass ({

  render:function(){
    return(
      <div id="about-div" className="starter-template">
      <h1 id="about-header" >About CrowdSauce</h1>
      <p id="about-paragraph" className="lead">CrowdSauce is a web application for sharing recipes with friends. The recipes can be home-cooked favorites, or links to your favorite cooking websites, like allrecipes.Our web application integrates with Facebook, allowing us to offer a full social experience. This experience includes commenting, sharing to Facebook, and viewing friends' profiles. Additionally, when one posts a recipe, they can add their own notes, e.g, substitutions made. With these notes, cooks can also share their thoughts on the final product, providing you with reviews from the people you trust.</p>
      </div>
    );
  },
});

ReactDOM.render(<About/>, about);