angular.module('quizzoMusic', ['quizzoMusic.controllers', 'quizzoMusic.services', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

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
      url: '/login/auth/:ID',
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
  // add $httpInterceptor into the array of interceptors.
  $httpProvider.interceptors.push('AttachTokens');
});

