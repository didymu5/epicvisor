import moment from 'moment';
import _ from 'underscore';
// import momentRange from 'moment-range';

function mentorProfileSessionsController($scope, userService, userSessionSettings, user, $location) {
  $scope.defaultCareerFields = [
    "Corporate Development",
    "Strategic Planning",
    "Investment Banking",
    "Financial Management",
    "Real Estate",
    "Entrepreneurship",
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