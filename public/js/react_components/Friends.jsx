
var search = ""

var ListGroup = ReactBootstrap.ListGroup,
	ListGroupItem = ReactBootstrap.ListGroupItem,
	Image = ReactBootstrap.Image

var NoFriendsDisplay = React.createClass({
  render: function() {
     return (<div>
	 <b>Invite Friends Image</b>
	 </div>);
	 
  }
})
	
var FriendsList = React.createClass({

    getInitialState: function() {
      return {data: {data: []}}
    },
	onChange: function(event) {
		search = event.target.value;
		this.forceUpdate();

	},
    render: function() {
	
		var friends = this.props.data
		
		// if no friends, display a 'no friends'
		var toDisplay = <NoFriendsDisplay />		
		
		var profileNavigation = this.props.profileNavigation
		if (friends) {
			toDisplay = 
			(friends["data"]).map(function(friend_data) {
				console.log("onefriend " + JSON.stringify(friend_data, null, 4))
				return (
					<OneFriend 
						data={friend_data} 
						string={search}
						profileNavigation={profileNavigation}/>
				)
			})
			console.log("Friends.jsx: " + JSON.stringify(friends["data"], null, 4))
		}
   		return (
			<div> 
				<ListGroup>
				<ListGroupItem>Friends</ListGroupItem>
				{toDisplay}
				<input type="text" onChange={this.onChange}/>
				</ListGroup>
			</div>
	    );
    }
});	

var OneFriend = React.createClass({
    render: function() {
        return (
			<div>
				{this.props.data.name.indexOf(this.props.string) > -1 ? 
				<ListGroupItem> 
				<Image src = "http://www.chicagobusiness.com/images/icons/default-user-icon.png" />
				<span>
					<ProfileLink 
					  profileNavigation={this.props.profileNavigation}
					  userId={this.props.data.id}
					  userName={this.props.data.name}/> 
					
				</span>
					
				</ListGroupItem> : false}
			</div>
        );
    },
});

//ReactDOM.render(<FriendsList />, friends);