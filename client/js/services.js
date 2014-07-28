angular.module('quizzoMusic.services',[])

// http intercepter to attach JWT to each HTTP call to the nodeJS server
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

  // currently only hip-hop
  // TODO: add a new page to allow user to select genre
  // Generate questions for the Quizz by calling the node server
  var generate = function () {
    return $http({
      method: 'GET',
      url: '/questions?&data=eg97074088215970048', //hardcode hip-hop ID
    }).then(function (resp) {
      return resp.data;
    });
  };

  return{
    generate:generate
  };
})

// sign out service; delete user JWT
.factory('signout', function($location, $window){

  var signout = function () {
    $window.localStorage.removeItem('com.quizzomusic');
    $location.path('/login');
  };

  return{
    signout:signout
  };
});