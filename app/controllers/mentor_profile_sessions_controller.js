import moment from 'moment';
import _ from 'underscore';
// import momentRange from 'moment-range';

function mentorProfileSessionsController($scope, userService, userSessionSettings, user, $location) {
  $scope.defaultCareerFields = [
    "Corporate Development",
    "Strategic Planning",
    "Investment Banking",
    "General Management",
    "Management Consulting",
    "Marketing",
    "Product Marketing",
    "Sales and Business Development",
    "Software Engineering",
    "Project Management"
  ];
  $scope.contacts = ["Skype", "Hangouts", "Phone","Other"];
  $scope.sessionCounts = Array.from(new Array(5), (x,i) => i+1);
  $scope.sessionCountTypes = ["Per Week", "Every Other Week"]; 
  $scope.topics = ["Work/Life/School Balance", "Clubs", "Career Paths & Entrepreneurship", "Commuting", "Preparing to start FEMBA", "Classes"];
  $scope.user = user;
  $scope.selectedTopics = {};
  $scope.selectedContact = userSessionSettings.contact || $scope.contacts[0];
  $scope.selectedSessionCountType = userSessionSettings.sessionCountType || $scope.sessionCountTypes[0];
  $scope.selectedSessionCount = userSessionSettings.sessionCount || $scope.sessionCounts[0];
  $scope.extraTopic1 = userSessionSettings.extraTopic1;
  $scope.extraTopic2 = userSessionSettings.extraTopic2;
  $scope.extraTopic3 = userSessionSettings.extraTopic3;
  if(userSessionSettings.career_topics) {
    $scope.careerTopic1 = userSessionSettings.career_topics[0]
    $scope.careerTopic2 = userSessionSettings.career_topics[1];
    $scope.careerTopic3 = userSessionSettings.career_topics[2];
  }
  $scope.contactDetails = userSessionSettings.contactDetails;
  $scope.timesGenerated = makeTimes();
  $scope.days = [{
      day: 'Sunday',
      startTimes: $scope.timesGenerated,
      endTimes: $scope.timesGenerated,
      selectedStartTime: null,
      selectedEndTime: null
    },
    {
      day: 'Monday',
      startTimes: $scope.timesGenerated,
      endTimes: $scope.timesGenerated,
      selectedStartTime: null,
      selectedEndTime: null
    },
    {
      day: 'Tuesday',
      startTimes: $scope.timesGenerated,
      endTimes: $scope.timesGenerated,
      selectedStartTime: null,
      selectedEndTime: null
    },
    {
      day: 'Wednesday',
      startTimes: $scope.timesGenerated,
      endTimes: $scope.timesGenerated,
      selectedStartTime: null,
      selectedEndTime: null
    },
    {
      day: 'Thursday',
      startTimes: $scope.timesGenerated,
      endTimes: $scope.timesGenerated,
      selectedStartTime: null,
      selectedEndTime: null
    },
    {
      day: 'Friday',
      startTimes: $scope.timesGenerated,
      endTimes: $scope.timesGenerated,
      selectedStartTime: null,
      selectedEndTime: null
    }];
    userSessionSettings.preferredTimeFrame.forEach(function(timeframe) {
       var matchingDay = _.find($scope.days, function(setTimeframe) {
        return setTimeframe.day == timeframe.day;
       });
       if(matchingDay) {
        var matchingStartTime = _.find(matchingDay.startTimes, function(time) {
          return time.formattedTime === timeframe.selectedStartTime.formattedTime;
        });
        var matchingEndTime = _.find(matchingDay.endTimes, function(time) {
          return time.formattedTime === timeframe.selectedEndTime.formattedTime;
        });
        matchingDay.selectedStartTime = matchingStartTime;
        matchingDay.selectedEndTime = matchingEndTime;
       }
    });
    $scope.email_address = user.email_address;

  if(userSessionSettings.topics) {
     userSessionSettings.topics.forEach(function(topic){
      $scope.selectedTopics[topic] = true;
    });
  }
  var extractTopics = function() {
    return Object.keys($scope.selectedTopics);
  }
  $scope.makePreferredTime = function() {
    let preferredDays = [];
    _.each($scope.days, function(day) {
      if(_.isObject(day.selectedStartTime) && _.isObject(day.selectedEndTime)) {
        preferredDays.push(_.omit(day, 'startTimes', 'endTimes'));
      }
    });
    return preferredDays;
  }

  function extractCareerTopics() {
    return [$scope.careerTopic1, $scope.careerTopic2, $scope.careerTopic3]
    .filter(function(topic) { return topic !== undefined});
  }

  function makeTimes() {
    var times = [];
    for(var i=0; i<48; i++) {
      var time = moment().startOf('day').add(i*30, 'minutes');
      times.push({time: time.toDate(), formattedTime: time.format("h:mm a")});
    }
    return times;
  }

  function timesNotValid(preferredTimes){
    var isInvalid = false;
    preferredTimes.forEach(function(time) {
      if(time.selectedStartTime && time.selectedEndTime) {
        if(moment(time.selectedStartTime.time).isAfter(moment(time.selectedEndTime.time))){
          isInvalid = true;
        }  
      }
    })
    return isInvalid;
  }
  $scope.setFocusOnError = function() {
    document.getElementsByClassName('error-session-time')[0].focus();
  }
  $scope.saveSessionState = function() {
    $scope.loading = false;
    if(timesNotValid($scope.makePreferredTime())) {
      $scope.sessionStatusText = "You have a start time that is after an end time. Please either blank out a day if not available or make valid timeframe."
      return false;
    }
    return userService.setSessionSettings({
      contact: $scope.selectedContact,
      sessionCountType: $scope.selectedSessionCountType,
      sessionCount: $scope.selectedSessionCount,
      extraTopic1: $scope.extraTopic1,
      extraTopic2: $scope.extraTopic2,
      extraTopic3: $scope.extraTopic3,
      contactDetails: $scope.contactDetails,
      topics: extractTopics(),
      career_topics: extractCareerTopics(),
      preferredTimeFrame: $scope.makePreferredTime()
    }).then(function(data) {
      $scope.loading = true;
      $scope.savedText = "Your details have been saved."
      $location.path('/profile');
    })
  }

}
mentorProfileSessionsController.$resolve = {
  user: ["userService", function(userService) {
    return userService.getUser();
  }],
  userSessionSettings: ["userService", function(userService) {
    return userService.getSessionSettings();
  }]
};
mentorProfileSessionsController.$inject = ["$scope", "userService", "userSessionSettings", "user", "$location"];
export default mentorProfileSessionsController;