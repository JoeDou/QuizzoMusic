angular.module('quizzoMusic', ['quizzoMusic.controllers', 'quizzoMusic.services', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  //set up UI router for Angular
  $stateProvider

    .state('login', {
      url: '/login',
      views: {
        'home': {
          templateUrl: 'templates/home-login.html',
          controller: 'LoginCtrl'
        }
      }
    })

    .state('auth', {
      url: '/login/auth/:ID', //Note: ID here is setup to catch JWT that's attached from NodeJS redirect
      views: {
        'home': {
          templateUrl: 'templates/home-login.html',
          controller: 'AuthCtrl'
        }
      }
    })

    .state('game', {
      url: '/game',
      views: {
        'home': {
          templateUrl: 'templates/game.html',
          controller: 'GameCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/login');
  // add $httpInterceptor into the array of interceptors; attaches JWT to each http message to node server
  $httpProvider.interceptors.push('AttachTokens');
});

