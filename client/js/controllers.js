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
  createQuestions.generate().then(function(data){
    console.log('questions', data);
  });


  var bam = new BeatsAudioManager("myBeatsPlayer");
  bam.on("ready", handleReady);
  bam.on("error", handleError);

  function handleReady() {
    bam.clientId = 'pv434b4qe2x9qhwqemx5uwmg';
    bam.authentication = {
        access_token:'43rjk2bcrv5x6kzczb3p4mth',
        user_id:'205374912020349184'
    };
    bam.identifier = 'tr58141709';
    // bam.load();
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