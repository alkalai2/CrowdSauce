// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  if (response.status === 'connected') {
    // User is logged into your app, should display main feed.
    FB.api('/me', function(response2) {
      // This function is used to obtain information about the user.
      document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response2.name + '!';
    });
  } else {
    // User is not logged in, should display login page.
    document.getElementById('status').innerHTML = "You are not logged in";
  }
}
// This function is called when someone finishes with the Login Button.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}
window.fbAsyncInit = function() {
  FB.init({
    appId      : '563086800536760',
    cookie     : true,  // enable cookies to allow the server to access the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5'
  });
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};
// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
