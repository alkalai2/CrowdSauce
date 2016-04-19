

var Comment = React.createClass({
  	render : function() {
  		return (
  		<div>
  		<div className="fb-comments" data-href={"http://localhost:3000/"+this.props.id} data-numposts="5">
  		</div>
  		</div>
  		); 		
  	},
});