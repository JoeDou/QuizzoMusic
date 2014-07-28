angular.module('quizzoMusic.controllers',[])

.controller('LoginCtrl', function($scope, $window, $state) {
  console.log('in login controler');
})

.controller('AuthCtrl', function($scope, $window, $location, $stateParams, $state) {
  console.log('in Auth controler', $location.url());
  console.log('id', $stateParams.ID);
  $window.localStorage.setItem('com.shortly', $stateParams.ID);
  $state.transitionTo('game');
})

.controller('GameCtrl', function($scope, $window, $location, $stateParams, $state) {
  var jwt = $window.localStorage.getItem('com.shortly');
  console.log('jwt', jwt);
  $state.transitionTo('game');
});