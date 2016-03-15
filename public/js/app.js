'use strict';

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
    otherwise({
      redirectTo: '/home'
    });

  // $locationProvider.html5Mode(true);
});

myApp.controller('ApplicationController', function($scope) {
  $scope.hello = "Hello linkedin!"
}).controller('HomeController', function($scope, $http) {
  $http.get('/user/info').then(function(res) {
    if(res.data) {
      $scope.user = res.data;
    }
  })
});