angular.module('quizzoMusic.controllers',[])

.controller('LoginCtrl', function($scope, $window, $state) {
  console.log('in login controler');
})

.controller('AuthCtrl', function($scope, $window, $location, $stateParams, $state) {
  console.log('in Auth controler', $location.url());
  console.log('id', $stateParams.ID);
  $window.localStorage.setItem('com.quizzomusic', $stateParams.ID);
  $state.transitionTo('game');
})

.controller('GameCtrl', function($scope, createQuestions) {
  $scope.index = 0;
  $scope.data = {};
  var bam = new BeatsAudioManager("myBeatsPlayer");
  bam.on("error", handleError);
  
  createQuestions.generate().then(function(data){
    console.log('questions', data);
    bam.on("ready", handleReady(data));
    $scope.data = data.data;
  });

  $scope.nextQuestion = function(index){
    bam.stop();
    console.log('in questions');
    console.log('data',$scope.data);
    bam.identifier = $scope.data.questions[index].id;
    bam.load();
    $scope.index++;
  };

  function handleReady(data) {
    bam.clientId = data.clientId;
    bam.authentication = data.authentication;
  }

  function handleError(value) {
    console.log("Error: " + value);
    switch(value){
      case "auth":
      // Beats Music API auth error (401)
      break;
      case "connectionfailure":
      // audio stream connection failure
      break;
      case "apisecurity":
      // Beats Music API crossdomain error
      break;
      case "streamsecurity":
      // audio stream crossdomain error
      break;
      case "streamio":
      // audio stream io error
      break;
      case "apiio":
      // Beats Music API io error getting track data
      break;
      case "flashversion":
      // flash version too low or not installed
      break;
    }
  }

});