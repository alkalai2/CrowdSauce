var Badge = ReactBootstrap.Badge;
var Jumbotron = ReactBootstrap.Jumbotron;
var NoTrendsDisplay = React.createClass({
  render: function() {
     return (<div>
	 <b>There are no Trends</b>
	 </div>);
	 
  }
})


var TrendsList = React.createClass({

    getInitialState: function() {
      return {data: {data: []}, profileurls: "notloaded"}
    },
	onChange: function(event) {
		search = event.target.value;
		this.forceUpdate();

	},
    render: function() {
	
		var trends = this.props.data
		
		// if no friends, display a 'no friends'
		var toDisplay = <NoTrendsDisplay />		
		
		var i = 0
		var profileNavigation = this.props.profileNavigation
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
   		return (
			<div> 	
				<span>
					<Image className="trend-icon-image" src="../img/trend.png"/>
					<h2 className="trend-header">Trends</h2>
				</span>
				<ListGroup> {toDisplay} </ListGroup>
			</div>
	    );
    }
});

var OneTrend = React.createClass({
    render: function() {
        return (
			<div>
				<ListGroupItem> 
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
