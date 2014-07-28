angular.module('quizzoMusic.services',[])

.factory('ServerUrls', function(){
  return {
    url: 'http://localhost:3000'
  };
})

.factory('AttachTokens', function ($window) {
  // stop all out going request then look in local storage and find the user's token
  // then add it to the header so the server can use the token
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.factory('signout', function($http, ServerUrls, $location, $window){

  var signout = function () {
    $window.localStorage.removeItem('com.quizzomusic');
    $location.path('/signin');
  };

  return{
    signout:signout
  };
});