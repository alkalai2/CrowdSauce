
function getFacebookDetails() {
  return new Promise(function(resolve, reject) {
    window.fbAsyncInit = function () {
      FB.init({
        appId: '563086800536760',
        cookie: true,  // enable cookies to allow the server to access the session
        xfbml: true,  // parse social plugins on this page
        version: 'v2.5'
      });
      FB.getLoginStatus(function (response) {
        if (response.status !== 'connected') {
          window.location.replace('login');
        }
        fbUserID = response.authResponse.userID;
        fbAccessToken = response.authResponse.accessToken;
        fbDetails = {}
        fbDetails['fbUserID'] = fbUserID
        fbDetails['fbAccessToken'] = fbAccessToken
        resolve(fbDetails)
      });
    };
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  })
}
