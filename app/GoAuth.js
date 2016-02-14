var http = require('http');

// YouTube Audio Player - only for development
var ClientID = '381192082009-l8t89vtuinh2qjint5lmohcm0tvl7l20.apps.googleusercontent.com';
var ApiKey = 'AIzaSyBT42EqbWvSYTSKC0mkV1liDY1aR7Dj9NA';
var ClientSecret = '3thinlyfW5DOYQ8TBKUn1uos';
var RedirectUrl = 'urn:ietf:wg:oauth:2.0:oob';


var GoAuth = function() {
  
  var GetKey = function(callback) {
    callback({
      CLIENT_ID : ClientID,
      API_KEY : ApiKey,
      CLIENT_SECRET : ClientSecret,
      REDIRECT_URL : RedirectUrl,
    });
  }
    
  return {
    getKey: GetKey
  }
}();

module.exports = GoAuth;