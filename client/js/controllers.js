angular.module('quizzoMusic.controllers',[])

//Login Controller (landing page)
.controller('LoginCtrl', function($scope) {
  console.log('in login controler');
})

//Authentication controller for Beats OAuth2.0
.controller('AuthCtrl', function($scope, $window, $location, $stateParams, $state) {
  // console.log('in Auth controler', $location.url());
  // console.log('id', $stateParams.ID);
  // $stateParamsID is setup to catch JWT -> when server returns a URL from redirect
  // JWT is attached to the Angular oauth url
  $window.localStorage.setItem('com.quizzomusic', $stateParams.ID);
  $state.transitionTo('game');
})

.controller('GameCtrl', function($scope, createQuestions, signout) {
  // initialize variables
  $scope.index = 0; //question number
  $scope.score = 0; //current score
  $scope.answer = ''; //title to the current song playing
  $scope.data = {}; //data from nodeJS server including song title, id and questions
  $scope.choice = []; //array of song titles for the questions
  $scope.lastQuestion = false; //check to determin if it's the last question
  $scope.first = true; //first time entering the gameboard
  $scope.win = false; //check to see if user answered enough right questions

  // initialize BAM
  var bam = new BeatsAudioManager("myBeatsPlayer");
  bam.on("error", handleError);

  // start function to handle initialization of variables and bam player
  $scope.start = function(){
    createQuestions.generate().then(function(data){
      console.log('questions', data);
      bam.on("ready", handleReady(data));
      $scope.data = data.data;
      $scope.answer = '';
      $scope.score = 0;
      // call nextQuestion function to start the quizz
      $scope.nextQuestion($scope.index);
      if ($scope.first){
        $scope.first = false;
      }
      $scope.win =false;
    });
  };

  // function to handle the next quetsions 
  // load next song and increment index
  $scope.nextQuestion = function(index){
    // on first call, no answer to submit so skip
    if (index !== 0){
      $scope.submit();
    }
    // console.log('in questions');
    // console.log('data',$scope.data);
    // console.log('index', $scope.index);
    bam.identifier = $scope.data.questions[index].id;
    createSelection();
    bam.load();
    $scope.index++;
    //check to see if it's the last question
    if ($scope.index === 5){
      $scope.lastQuestion = true;
    }
  };

  // submit function to enter answer selection and compare to solution
  // if select the correct answer, increment score
  $scope.submit = function(){
    bam.stop();
    var correctAnswer = $scope.data.questions[$scope.index-1].name;
    var selectedAnswer = $scope.choice[$scope.answer];
    // console.log('correct Answer',correctAnswer);
    // console.log('selected Answer',selectedAnswer);

    if (correctAnswer === selectedAnswer){
      $scope.score++;
    }
    if ($scope.lastQuestion){
      $scope.index =0;
      $scope.lastQuestion = false;
    }
    if ($scope.score > 2){
      $scope.win = true;
    }
  };
  
  // call sign out function
  $scope.signout = function(){
    signout.signout();
  };

  // randomly pick the a location for the correct answer and
  // fill out the rest of array with wrong answers
  function createSelection(){
    var index = Math.floor(Math.random()*4);
    var j =0;
    var temp = [];
    for (var i=0; i< 4; i++){
      if (index === i){
        temp.push($scope.data.questions[$scope.index].name);
      }else{
        temp.push($scope.data.questions[$scope.index].wrong[j]);
        j++;
      }
    }
    $scope.choice = temp;
    // console.log('choices', $scope.choice);
  }
  
  // initialize bam player
  function handleReady(data) {
    bam.clientId = data.clientId;
    bam.authentication = data.authentication;
  }

  // handle bam player errors
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