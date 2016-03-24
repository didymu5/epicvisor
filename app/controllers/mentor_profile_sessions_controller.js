function mentorProfileSessionsController($scope, userService) {
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
  
}
mentorProfileSessionsController.$inject = ["$scope", "userService"];
export default mentorProfileSessionsController;