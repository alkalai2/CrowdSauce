/**
 * @jsx React.DOM
 */

var post_data1 = {
  "userId" : 123456, 
  "title" : "Spicy Chicken Enchiladas",
  "ingredients": ["ingredient 1",  "ingredient 2",  "ingredient 3"],
  "directions" : ["mix two eggs", "fry bacon", "toast bread"], 
  "recipeLink" : "http://iamafoodblog.com/ivan-ramen-toasted-rye-ramen-noodles/",
  "imageLink" : "http://i.imgur.com/SyZyVmN.jpg", 
  "tags" : ["chicken", "dinner", "spicy", "orange"],
  "notes": "This was everything I wanted. Nice texture to the chicken with the high stove heat, and the added spices really gave it a nice kick. I would recommend using cayenne to taste for those that like it less hot! Delicious! Okay!",
  "rating": 4,
  "timestamp": "Feb 24, 2016"
}

var post_data2 = {
  "userId" : 9999, 
  "title" : "Salty Mushroom Tacos ",
  "ingredients": ["Salty ",  "Mushrooms ",  "Tacos "],
  "directions" : ["add salt", "grill mushrooms", "make tacos"], 
  "recipeLink" : "http://iamafoodblog.com/ivan-ramen-toasted-rye-ramen-noodles/",
  "imageLink" : "http://i.imgur.com/BjA1g9f.jpg", 
  "tags" : ["salty", "mushroom", "tacos", "gross"],
  "notes": "These were awful. Not that salty, barely any mushrooms, all in a falling-apart taco. I'm a bad cook.",
  "rating": 3,
  "timestamp": "Feb 24, 2016"
}

var Feed = React.createClass({
    render: function() {
   		return (
	    	<div>
	    		<Post data={post_data1}/>
	    		<Post data={post_data2}/>
	    	</div>
	    );
    }
});

ReactDOM.render(<Feed />, posts);
