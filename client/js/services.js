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
      var jwt = $window.localStorage.getItem('com.quizzomusic');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.factory('createQuestions', function($http){
  // "id": "eg97074088215970048",
  // "username": "beatshiphop",
  // "name": "Beats Hip-Hop",
  // "verified": false,
  // "total_follows": 0,
  // "total_followed_by": 76900,
  // "playlist_count": 890,
  // "user_id": "97074088224358656",
  // "type": "genre"

  var generate = function () {
    return $http({
      method: 'GET',
      url: '/questions?&data=eg97074088215970048',
    }).then(function (resp) {
      return resp.data;
    });
  };

  return{
    generate:generate
  };
})

.factory('signout', function($location, $window){

  var signout = function () {
    $window.localStorage.removeItem('com.quizzomusic');
    $location.path('/login');
  };

  return{
    signout:signout
  };
});