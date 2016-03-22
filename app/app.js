
'use strict';
import angular from 'angular';

import angular_routes from 'angular-route';

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

}).directive('profileMenu', function() {
  return {
    templateUrl: 'templates/directives/profile_menubar.html'
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
.service('userService', function($http, $q) {
  var userState = {};
  var userStateFetch = $http.get('/user/info').then(function(res) {
    userState.user = res.data;
    return userState.user;
  });
  function makeSessions(sessions, sessionState) {
    var numberOfSessionsToGenerate = sessionState.sessionCount;
    for(var week=0; week <4; week++) {
      for(var sessionNumber=0; sessionNumber<numberOfSessionsToGenerate; sessionNumber++) {
        sessions.push({
          date: moment().add(week, 'week'),
          number: sessionNumber+1,
          status: 'Open'
        })
      }
    }
    return sessions;
  }
  return {
    getUser: function() {
      return userStateFetch;
    },
    getProfile: function() {
      return $http.get('/user/mentor/profile').then(function(res) {
        userState.profile = res.data;
        return userState.profile;
      });
    },
    getSessions: function() {
      var self = this;
      return $http.get('/sessions/user').then(function(res) {
        var sessions = res.data;
        return self.getSessionSettings().then(function(sessionState) {       
          return makeSessions(sessions, sessionState);
        })
      });
    },
    getSessionSettings: function() {
      return $http.get('/user/mentor/settings/session').then(function(res) {
        userState.sessionSettings = res.data;
        return userState.sessionSettings;
      });
    },
    setSessionSettings: function(sessionState) {
      return $http({
        method: 'POST',
        url: '/user/mentor/settings/session/create',
        data: {
          sessionState
        }
      });
    },
    setProfileSettings: function(profileSettings) {
      return $http({
        method: 'POST',
        url: '/user/mentor/profile/create',
        data: {
          profileSettings
        }
      });
    }
  };
})

myApp.controller('ApplicationController', function($scope, userService) {
  userService.getUser().then(function(user) {
    $scope.user = user;
  });
  $scope.signedIn = function() {
    return $scope.user;
  }
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
   userService.getProfile().then(function(profile) {
      $scope.selectedYear = profile.year || "2016";
      $scope.blurb = profile.blurb || "";
   });
   userService.getSessions().then(function(sessions) {
    $scope.sessions = sessions;
  });

   $scope.years = Array.from(new Array(2016-1940), (x,i) => 2016-i);
   $scope.saveProfile = function() {
    userService.setProfileSettings({
      blurb: $scope.blurb,
      year: $scope.selectedYear
    });
   }

}).controller('MentorProfileSessionsController', function($scope, userService) {
  userService.getUser().then(function(user) {
      $scope.user = user;
  });  
  $scope.selectedTopics = {};
  userService.getSessionSettings().then(function(userSessionSettings) {
    $scope.selectedContact = userSessionSettings.contact || $scope.contacts[0];
    $scope.selectedSessionCountType = userSessionSettings.sessionCountType || $scope.sessionCountTypes[0];
    $scope.selectedSessionCount = userSessionSettings.sessionCount || $scope.sessionCounts[0];
    $scope.extraTopic1 = userSessionSettings.extraTopic1;
    $scope.extraTopic2 = userSessionSettings.extraTopic2;
    $scope.extraTopic3 = userSessionSettings.extraTopic3;
    $scope.contactDetails = userSessionSettings.contactDetails;
    if(userSessionSettings.topics) {
       userSessionSettings.topics.forEach(function(topic){
        $scope.selectedTopics[topic] = true;
      });
    }

   
  })
  var extractTopics = function() {
    return Object.keys($scope.selectedTopics)
  }

  

  $scope.saveSessionState = function() {
    $scope.loading = false;
    return userService.setSessionSettings({
      contact: $scope.selectedContact,
      sessionCountType: $scope.selectedSessionCountType,
      sessionCount: $scope.selectedSessionCount,
      extraTopic1: $scope.extraTopic1,
      extraTopic2: $scope.extraTopic2,
      extraTopic3: $scope.extraTopic3,
      contactDetails: $scope.contactDetails,
      topics: extractTopics()
    }).then(function(data) {
      $scope.loading = true;
      $scope.savedText = "Your details have been saved."
    })
  }
  $scope.sessionCounts = Array.from(new Array(5), (x,i) => i+1);
  $scope.sessionCountTypes = ["Per Week", "Per Month"]; 
  $scope.topics = ["Career Advancement", "Building a Team","Internships","International Business","Raising Funding","Work Life Balance"];
  $scope.contacts = ["Skype", "Email", "Google Hangouts"]
  
});