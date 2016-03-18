
'use strict';
import angular from 'angular/angular';
import angular_routes from 'angular-route/angular-route';

// Declare app level module which depends on filters, and services

var myApp = angular.module('myApp', [
  'ngRoute'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/home', {
      templateUrl: 'templates/home.html',
      controller: 'HomeController'
    }).
    when('/profile', {
      templateUrl: 'templates/profile.html',
      controller: 'MentorProfileController'
    }).
    when('/profile/sessions', {
      templateUrl: 'templates/profile_sessions.html',
      controller: 'MentorProfileSessionsController'
    }).
    otherwise({
      redirectTo: '/home'
    });

  // $locationProvider.html5Mode(true);
});

myApp.service('userService', function($http, $q) {
  var userState = {};
  var userStateFetch = $http.get('/user/info').then(function(res) {
    userState.user = res.data;
    return userState.user;
  });
  return {
    getUser: function() {
      return userStateFetch;
    },
    getProfile: function() {
      return $http.get('/user/mentor/profile').then(function(res) {
        return userState.profile;
      });
    },
    getSessionSettings: function() {
      return $http.get('/user/mentor/settings/session').then(function(res) {
        return userState.settings;
      });
    }
  };
})

myApp.directive('profile_menu', function() {
  return {
    templateUrl: 'templates/profile_menubar.html'
  }
})

myApp.controller('ApplicationController', function($scope) {
  $scope.hello = "Hello linkedin!"
}).controller('HomeController', function($scope, userService) {
  userService.getUser().then(function(user) {
    if(user) {
      $scope.user = user;
    }
  });
}).controller('MentorProfileController', function($scope, userService) {
   userService.getUser().then(function(user) {
      $scope.user = user;
  });
   $scope.years = Array.from(new Array(2016-1940), (x,i) => i+1940);

}).controller('MentorProfileSessionsController', function($scope, userService) {
  userService.getUser().then(function(user) {
      $scope.user = user;
  });  

});