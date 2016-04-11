var MyProfile = React.createClass({
    render : function() {
      return (
       	<Profile 
       	myprofile={true}
       	editable={true}/>
      );    
    },
});

ReactDOM.render(<MyProfile />, posts);