
'use strict';
import angular from 'angular';
import mentorProfileController from './controllers/mentor_profile_controller';

import angular_routes from 'angular-route';
import mentorDetailsController from './controllers/mentor_details_controller';
import bookSessionController from './controllers/book_session_controller';
import sessionDetailsController from './controllers/session_details_controller';
import moment from 'moment';
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
    when('/mentors/:mentor_id', {
      templateUrl: 'templates/mentor_details.html',
      controller: 'MentorDetailsController',
      resolve: mentorDetailsController.$resolve
    }).
    when('/profile', {
      templateUrl: 'templates/profile.html',
      controller: 'MentorProfileController',
      resolve: mentorProfileController.$resolve
    }).
    when('/profile/sessions', {
      templateUrl: 'templates/profile_sessions.html',
      controller: 'MentorProfileSessionsController'
    }).
    when('/mentor/sessions/confirm', {
      templateUrl: 'templates/book_session.html',
      controller: 'BookSessionController',
      resolve: bookSessionController.$resolve

    }).
    when('/sessions/:session_id', {
      templateUrl: 'templates/session_details.html',
      controller: 'SessionDetailsController',
      resolve: sessionDetailsController.$resolve

    }).
    when('/landing',
      {
        templateUrl: 'templates/landing.html',
        controller: 'ProfileSearchController'
      }).
    otherwise({
      redirectTo: '/home'
    });

}).directive('headerNav', function() {
  return {
    templateUrl: 'templates/directives/header_nav.html'
  }
}).directive('topic', function() {
  return {
    link: function(scope, element, attrs) {
      scope.selectTopic = function() {
        scope.$parent.selectedTopics[scope.topicToSelect] = true;
      }
      scope.$parent.$watch('selectedTopics', function(oldValue, newValue) {
        scope.selectedTopic = newValue[scope.topicToSelect]
      });
    },
    scope: {
      topicToSelect: '='
    },
    templateUrl: 'templates/directives/topic.html'

   
  }
})

import nameFilter from './filters/name_filter';
myApp.filter('name', nameFilter);

import mentorService from './services/mentor_service';
import userService from './services/user_service';
import sessionsService from './services/sessions_service';
import studentService from './services/student_service';

myApp.service('mentorService', mentorService);
myApp.service('userService', userService);
myApp.service('sessionsService', sessionsService);
myApp.service('studentService', studentService);


import profileSearchController from './controllers/profile_search_controller';
import homeController from './controllers/home_controller';
import applicationController from './controllers/application_controller';
import mentorProfileSessionsController from './controllers/mentor_profile_sessions_controller';
myApp.controller('BookSessionController', bookSessionController);
myApp = myApp.controller('HomeController', homeController);
myApp = myApp.controller('ApplicationController', applicationController);
myApp = myApp.controller('MentorProfileController', mentorProfileController);
myApp = myApp.controller('MentorProfileSessionsController', mentorProfileSessionsController);
myApp = myApp.controller('ProfileSearchController', profileSearchController);
myApp = myApp.controller('MentorDetailsController', mentorDetailsController);
myApp = myApp.controller('SessionDetailsController', sessionDetailsController);