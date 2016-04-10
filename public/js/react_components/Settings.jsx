


var Settings = React.createClass ({
    render: function() {
    	return (
    		<div>
            <span className="setting_label">Setting 1</span> 

          <label className="switch">
            <input className="switch-input" type="checkbox" />
            <span className="switch-label" data-on="On" data-off="Off"></span>
            <span className="switch-handle"></span> 
          </label>

            <span className="setting_label">Setting 2</span> 

          <label className="switch"> 
            <input className="switch-input" type="checkbox" />
            <span className="switch-label" data-on="On" data-off="Off"></span>
            <span className="switch-handle"></span> 
          </label>

            <span className="setting_label">Setting 3</span> 

          <label className="switch"> 
            <input className="switch-input" type="checkbox" />
            <span className="switch-label" data-on="On" data-off="Off"></span>
            <span className="switch-handle"></span> 
          </label>
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