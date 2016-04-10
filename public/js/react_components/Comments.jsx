

var Comment = React.createClass({
	/*
	componentDidMount : function() {
	
	
  	window.fbAsyncInit = function() {
  	FB.init({
  		appId      : '563086800536760',
  		cookie     : true,  // enable cookies to allow the server to access the session
  		xfbml      : true,  // parse social plugins on this page
  		version    : 'v2.5'
  	});
  	
  	}.bind(this);
  	// Load the SDK asynchronously
  	(function(d, s, id) {
  	var js, fjs = d.getElementsByTagName(s)[0];
  	if (d.getElementById(id)) return;
  	js = d.createElement(s); js.id = id;
  	js.src = "//connect.facebook.net/en_US/sdk.js";
  	fjs.parentNode.insertBefore(js, fjs);
  	}(document, 'script', 'facebook-jssdk'));
  	
  	$(document).on(
      'fbload', 
  	 function(){
  		FB.XFBML.parse();
  		//alert("load sdk");
  	});
	
	
      },
  	
  	componentDidUpdate : function() {
      FB.XFBML.parse();
  	//alert("parsed");
  	},
  	*/
  	render : function() {
  		return (
  		<div>
  		<div className="fb-comments" data-href={"http://localhost:3000/"+this.props.id} data-numposts="5">
  		</div>
  		</div>
  		); 		
  	},
});