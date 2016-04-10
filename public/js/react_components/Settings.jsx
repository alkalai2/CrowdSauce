

var Input = ReactBootstrap.Input
var ButtonInput = ReactBootstrap.ButtonInput
var Image = ReactBootstrap.Image
var Thumbnail = ReactBootstrap.Thumbnail
var fbDetails = getFacebookDetails();


var Settings = React.createClass ({

	getInitialState() {
		return{
			username: '',
			email:'',
			imgsrc: 'https://s-media-cache-ak0.pinimg.com/736x/1a/39/55/1a39555080409fad4d86b94a9af46b97.jpg',
		};
	},



	handleSave(){
		var img = this.state.imgsrc.trim();
		var name = this.state.username.trim();
		var email = this.state.email.trim();

		var data = {
		  img: img,
		  email: email,
		  name: name,
		  notification: true

		};
		
		var heads = {
            'userid': fbDetails['fbUserID'],
            'accesstoken': fbDetails['fbAccessToken']
		};
		
		var url = 'http://localhost:3000/api/accounts/';
		jQuery.ajax({
		  url: url,
		  dataType: 'json',
		  type: 'PUT',
		  data: data,
		  headers: heads,
		  success: function(responsedata) {
		    console.log(responsedata)
		    console.log("SUCCESSFUL SAVE")
		    console.log(heads)
		  }.bind(this),
		  error: function(xhr, status, err) {
		    console.log(err.toString());
		    console.log("BAD SAVE")
		  }.bind(this)
		});		
	},


  	changeImgSrc: function(e) {
      this.setState({imgsrc: e.target.value});
  	},
  	changeEmail: function(e) {
      this.setState({email: e.target.value});
  	},
  	changeUsername: function(e) {
      this.setState({username: e.target.value});
  	},
    render: function() {

    	var imgStyle = {
    		float: 'right',
		    display: 'inline-block'
    	}
    	return (

    		<div>
		      <Thumbnail className="settingsThumb" src={this.state.imgsrc} alt="Enter a valid Picture link">
		      <form>
			  <Input
			    type="text"
			    label="Change Profile Picture"
			    placeholder="Image URL"
			    wrapperClassName="col-xs-15"
			    onChange={this.changeImgSrc}
			    value={this.state.imgsrc}
			  />
	          <Input 
				type="email"
				placeholder="Enter new email"
				label="Change Email Address"
			    onChange={this.changeEmail}
				value={this.state.email}
	          />
	          <Input 
				type="text"
				placeholder="Enter new Username"
				label="Change Username"
			    onChange={this.changeUsername}
				value={this.state.username}
	          />
	          </form>

		      <span className="setting_label">Allow email notifications?</span> 
	          <label className="switch">
	            <input className="switch-input" type="checkbox"/>
	            <span className="switch-label" data-on="On" data-off="Off"></span>
	            <span className="switch-handle"></span> 
	          </label>
		      </Thumbnail>
	          <ButtonInput bsStyle="primary" className="save_button" onClick={this.handleSave}>Save</ButtonInput>&nbsp;

        	</div>
    		);
    },
})

var MySettings = React.createClass({
	render: function() {
		return (
		<Settings/>
		);
	},
});




ReactDOM.render(<Settings/>, settings);