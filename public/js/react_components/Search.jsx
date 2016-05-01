
var Input = ReactBootstrap.Input,
  Button = ReactBootstrap.Button

// class to handle a Search from the main page
// display Search Bar
// handle a Search event, use API to get posts related to query 
var SearchBar = React.createClass({
	getInitialState: function() {
		return {value: ''}
	},

	handleChange: function(e){
      this.setState({value: e.target.value});
  	},  

  	// handle in FeedController
  	// use parent function to have displays change when a query is made
	handleSubmit: function(e) {
		e.preventDefault()
		var query = this.state.value.toLowerCase(this.state.value)
		this.props.handleSearch(query)
	},

    render : function() {
      return (
        <div className="search-bar">
          <form onSubmit={this.handleSubmit}>
	          <Input 
	          	autoFocus 
	          	className="search-input" 
	          	type="text" 
	          	placeholder=" What are you in the mood for?"
	          	onChange={this.handleChange}/>
	      </form>
        </div>
      );    
    },
});


	// class to represent the Search Results of a given query
	// load posts related to query
	var SearchResults = React.createClass({
		getInitialState: function() {
			return {data: []}
		},

		componentDidMount: function() {
			var self = this
			getFacebookDetails().then(function(fbDetails) {
				self.loadSearchResults(fbDetails)
			})
		},

		// get the posts related to the inputed search query
		// verify OK from API, set state with data received
		loadSearchResults: function(fbDetails) {

			// get search terms, remove whitespace, combine with ','  (how backend expects)
			query_terms = this.props.query.split(' ').map(function(q){return q.trim()})
			query_terms_string = query_terms.join()

			console.log("loading results for \'" + this.props.query + "\'..."); 
	        var url = "http://localhost:3000/api/tags/feed/"
	        jQuery.ajax({
	          url:  url,
	          type: 'GET',
	          headers: {
	            'Accept': 'text/html',
	            'userid': fbDetails['fbUserID'],
	            'accesstoken': fbDetails['fbAccessToken'],
	            'numposts': '10'
	          },
	          data: {
	          	'tagNames': query_terms_string
	          },
	          dataType: 'json',
	          timeout : 30000,
	          success: function(data) {
	            console.log(data)
	            if(data.length) {
	           		this.setState({data: data});
	           	}
	          }.bind(this),
	          error: function(xhr, status, err) {
	            console.error(this.props.source, status, err.toString());
	          }.bind(this)
	        });
		},

		render: function() {

			var fbDetails = this.props.fbDetails
		      if(this.props.fbDetails && !this.state.data.length) {
		        this.loadSearchResults(this.props.fbDetails)
		      } 

			return (
				<div> 
					<div className="search-banner">
						Recipes related to <i> {this.props.query}...</i>
						<span className="back-to-feed"> 
							<a href="#" onClick={this.props.backToFeed}> back to feed </a> 
						</span>
					</div>
					<div>
					<PostList 
					  data={this.state.data} 
					  favoriteAble={true}
					  searchBar = {false}
					  handleSearch={this.props.handleSearch}
					  errorMsg={"Oops! Could not find any posts related to " + this.props.query}/>
					 </div>
				</div>
			)
		}
})



