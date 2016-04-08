var MyProfile = React.createClass({
    render : function() {
      return (
       	<Profile 
       	editable={true}/>
      );    
    },
});

ReactDOM.render(<MyProfile />, posts);