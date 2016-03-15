'use strict';

// Declare app level module which depends on filters, and services

var myApp = angular.module('myApp', [
  'ngRoute',

  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/home', {
      templateUrl: 'partials/home',
      controller: 'HomeController'
    }).
    when('/room/:room_id', {
      templateUrl: 'partials/room',
      controller: 'RoomController'
    }).
    otherwise({
      redirectTo: '/home'
    });

  $locationProvider.html5Mode(true);
});

myApp.controller('ApplicationController', function($scope) {
  $scope.hello = "Hello linkedin!"
}).controller('HomeController', function($scope) {

});