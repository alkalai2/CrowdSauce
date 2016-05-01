
var search = ""

var ListGroup = ReactBootstrap.ListGroup,
	ListGroupItem = ReactBootstrap.ListGroupItem,
	Image = ReactBootstrap.Image

// This is the display (message) that is returned if the user has no friends
var NoFriendsDisplay = React.createClass({
  render: function() {
     return (<div>
	 <b>Invite Your Friends!</b>
	 </div>);
	 
  }
})
	
// This class would display the list of friends for the user	
// It also includes a textbox for searching through your friends
var FriendsList = React.createClass({

	// initial data for friends list
    getInitialState: function() {
      return {data: {data: []}, profileurls: "notloaded"}
    },
	
	// changes the list to the list of friends that have the searched term
	// this is case sensitive
	onChange: function(event) {
		search = event.target.value;
		this.forceUpdate();

	},
    render: function() {
	
		var friends = this.props.data
		var urls = this.props.profileurls
		
		// if no friends, display a 'no friends'
		var toDisplay = <NoFriendsDisplay />		
		
		var i = 0
		var profileNavigation = this.props.profileNavigation
		if (friends) {
			toDisplay = 
			(friends["data"]).map(function(friend_data) {
				console.log("onefriend " + JSON.stringify(friend_data, null, 4))
				if (urls) {
					url = urls[friend_data.id]
					i++
				} else {
					url = "https://cdn0.iconfinder.com/data/icons/duesseldorf/32/process.png"
				}
				return (
					<OneFriend 
						data={friend_data} 
						string={search}
						url={url}
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

// This represents one friend of the user
// It will return a picture and a name that links to that users post
var OneFriend = React.createClass({
    render: function() {
        return (
			<div>
				{this.props.data.name.indexOf(this.props.string) > -1 ? 
				<ListGroupItem> 
				<Image className="profile-image" src = {this.props.url} />
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

