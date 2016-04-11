var Input = ReactBootstrap.Input
var Button = ReactBootstrap.Button
var Image = ReactBootstrap.Image
var Thumbnail = ReactBootstrap.Thumbnail

var fbDetails = getFacebookDetails();

var Settings = React.createClass ({

	getInitialState() {
		return{
			value: '',
			imgsrc: 'https://s-media-cache-ak0.pinimg.com/736x/1a/39/55/1a39555080409fad4d86b94a9af46b97.jpg',
		};
	},

  	changeImgSrc: function(e) {
      this.setState({imgsrc: e.target.value});
  	},

	handleEmailChange() {
		this.setState({
			value:this.refs.input.getValue()
		});
	},
	
	deleteHandler: function(e) {
	  	var heads = {
            'userid': fbDetails['fbUserID'],
            'accesstoken': fbDetails['fbAccessToken']
		};
		
		var url = 'http://localhost:3000/api/accounts';
		jQuery.ajax({
		  url: url,
		  dataType: 'json',
		  type: 'DELETE',
		  data: {},
		  headers: heads,
		  success: function(responsedata) {
			console.log(responsedata)
		  }.bind(this),
		  error: function(xhr, status, err) {
			console.log(err.toString());
		  }.bind(this)
		});
	},

    render: function() {

    	var imgStyle = {
    		float: 'right',
		    display: 'inline-block'
    	}
    	return (

    		<div>
		      <Thumbnail className="settingsThumb" src={this.state.imgsrc} alt="Enter a valid Picture link">

			  <Input
			    type="text"
			    label="Change Profile Picture"
			    placeholder="Image URL"
			    wrapperClassName="col-xs-15"
			    onChange={this.changeImgSrc}
			    value={this.state.imgsrc}
			  />
	          <Input 
				type="text"
				value={this.state.value}
				placeholder="Enter new email"
				label="Change Email Address"
				onChange={this.handleEmailChange}
				ref="input"
        		groupClassName="group-class"
        		labelClassName="label-class"
	          />
	          <Input 
				type="text"
				value={this.state.value}
				placeholder="Enter new Username"
				label="Change Username"
				onChange={this.handleEmailChange}
				ref="input"
        		groupClassName="group-class"
        		labelClassName="label-class"
	          />


		      <span className="setting_label">Allow email notifications?</span> 
	          <label className="switch">
	            <input className="switch-input" type="checkbox"/>
	            <span className="switch-label" data-on="On" data-off="Off"></span>
	            <span className="switch-handle"></span> 
	          </label>
	          
	          <p>
	          <Button next onClick={this.deleteHandler} bsStyle="danger">DELETE ALL POSTS</Button>
	          </p>

		      </Thumbnail>
         	<p>
	          <Button bsStyle="primary">Save</Button>&nbsp;
	        </p>

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
