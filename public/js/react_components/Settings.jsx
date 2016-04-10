

var Input = ReactBootstrap.Input
var Button = ReactBootstrap.Button
var Image = ReactBootstrap.Image
var Thumbnail = ReactBootstrap.Thumbnail


var Settings = React.createClass ({

	getInitialState() {
		return{
			name: '',
			email:'',
			imgsrc: 'https://s-media-cache-ak0.pinimg.com/736x/1a/39/55/1a39555080409fad4d86b94a9af46b97.jpg',
		};
	},

  	changeImgSrc: function(e) {
      this.setState({imgsrc: e.target.value});
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
	          />
	          <Input 
				type="text"
				placeholder="Enter new Username"
				label="Change Username"
	          />
	          </form>

		      <span className="setting_label">Allow email notifications?</span> 
	          <label className="switch">
	            <input className="switch-input" type="checkbox"/>
	            <span className="switch-label" data-on="On" data-off="Off"></span>
	            <span className="switch-handle"></span> 
	          </label>
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