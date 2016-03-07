var friend_data = {
  "friendName" : "John Smith", 
  "imageLink" : "http://www.chicagobusiness.com/images/icons/default-user-icon.png" 
}
var friend_data2 = {
  "friendName" : "Jane Doe", 
  "imageLink" : "http://www.chicagobusiness.com/images/icons/default-user-icon.png" 
}
var friend_data3 = {
  "friendName" : "Kevin Wang", 
  "imageLink" : "http://www.chicagobusiness.com/images/icons/default-user-icon.png" 
}
var friend_data4 = {
  "friendName" : "Emily Reed", 
  "imageLink" : "http://www.chicagobusiness.com/images/icons/default-user-icon.png" 
}
var friend_data5 = {
  "friendName" : "Jake King", 
  "imageLink" : "http://www.chicagobusiness.com/images/icons/default-user-icon.png" 
}

var search = ""

var ListGroup = ReactBootstrap.ListGroup,
	ListGroupItem = ReactBootstrap.ListGroupItem,
	Image = ReactBootstrap.Image

var FriendsList = React.createClass({

	onChange: function(event) {
		search = event.target.value;
		this.forceUpdate();

	},
    render: function() {
   		return (
	    	<div>
				<ListGroup>
				<ListGroupItem>Friends</ListGroupItem>
	    		<OneFriend data={friend_data} string={search}/>
	    		<OneFriend data={friend_data2} string={search}/>
				<OneFriend data={friend_data3} string={search}/>
	    		<OneFriend data={friend_data4} string={search}/>
				<OneFriend data={friend_data5} string={search}/>
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
				{this.props.data.friendName.indexOf(this.props.string) > -1 ? 
				<ListGroupItem> 
				<Image src = {this.props.data.imageLink}/>
				{this.props.data.friendName}
				</ListGroupItem> : false}
			</div>
        );
    },
});

ReactDOM.render(<FriendsList />, friends);