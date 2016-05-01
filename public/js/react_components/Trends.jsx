var Badge = ReactBootstrap.Badge;

/* 
* NoTrendsDisplay:
* Alternate display for when there are no trending posts
*/
var NoTrendsDisplay = React.createClass({
  render: function() {
     return (<div>
	 <b>There are no Trends</b>
	 </div>);
	 
  }
})

/* 
*	TrendsList:
*	This class defines the list of trending posts in the sidebar
*	of the main feed page. It shows the 5 most favorited recent posts.
*/
var TrendsList = React.createClass({

	// initial state starts with no trending posts as data
    getInitialState: function() {
      return {data: {data: []}, profileurls: "notloaded"}
    },

    // when the data changes, we force update the feed 
    // with new trending posts
	onChange: function(event) {
		search = event.target.value;
		this.forceUpdate();
	},

    render: function() {
    	// if no trends, display 'no trends' class by default
		var toDisplay = <NoTrendsDisplay />	
		var trends = this.props.data	
		var i = 0
		var profileNavigation = this.props.profileNavigation

		// if trend data exists, display each trending post in a "OneTrend" class
		if (trends) {
			toDisplay = 
			(trends).map(function(trend_data) {
				console.log("one trend: " + JSON.stringify(trend_data, null, 4))
				return (
					<OneTrend
						data={trend_data} />
				)
			})
			console.log("Trends.jsx: " + JSON.stringify(trends, null, 4))
		}
		// returns the list of OneTrend classes which show the post name and # of favorites
   		return (
			<div> 	
				<span>
					<Image className="trend-icon-image" src="../img/trend.png"/>
					<h2 className="trend-header">Trends</h2>
				</span>
				<ListGroup componentClass="div"> {toDisplay} </ListGroup>
			</div>
	    );
    }
});

/*
* OneTrend:
* This class represents a single trending post in the TrendsList class.
* Each Trend will show the post title and the number of favorites.
*/
var OneTrend = React.createClass({
	// Simply renders a ListGroupItem containing the title and favorites
    render: function() {
        return (
			<div>
				<ListGroupItem className="trend-list-group-item"> 
					<Image className="profile-image" src = {this.props.url} />
					<span className="trend-title">
						  {this.props.data.title}
					</span>
					<Image className="trend-favorite-image" src="../img/heart-filled.png"/>
					<span className="trend-favorites">
						<Badge className="trend-badge">
						  {this.props.data.favorites}
						</Badge>
					</span>
				</ListGroupItem>
			</div>
        );
    },
});
