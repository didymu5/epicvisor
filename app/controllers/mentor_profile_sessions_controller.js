function mentorProfileSessionsController($scope, userService, userSessionSettings, user) {
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
  $scope.contacts = ["Skype", "Email", "Google Hangouts"];
  $scope.sessionCounts = Array.from(new Array(5), (x,i) => i+1);
  $scope.sessionCountTypes = ["Per Week", "Per Month"]; 
  $scope.topics = ["Career Advancement", "Building a Team","Internships","International Business","Raising Funding","Work Life Balance"];
  

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
  if(userSessionSettings.topics) {
     userSessionSettings.topics.forEach(function(topic){
      $scope.selectedTopics[topic] = true;
    });
  }

   
  var extractTopics = function() {
    return Object.keys($scope.selectedTopics);
  }

  function extractCareerTopics() {
    return [$scope.careerTopic1, $scope.careerTopic2, $scope.careerTopic3]
    .filter(function(topic) { return topic !== undefined});
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
      career_topics: extractCareerTopics()
    }).then(function(data) {
      $scope.loading = true;
      $scope.savedText = "Your details have been saved."
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
mentorProfileSessionsController.$inject = ["$scope", "userService", "userSessionSettings", "user"];
export default mentorProfileSessionsController;