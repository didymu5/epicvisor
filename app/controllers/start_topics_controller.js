function startTopicsController($scope, $location,sessionsService, userSessionSettings, userService) {
  $scope.topics = sessionsService.getDefaultTopics();
  $scope.selectedTopics = {};
  if(userSessionSettings.topics) {
     userSessionSettings.topics.forEach(function(topic){
      $scope.selectedTopics[topic] = true;
    });
  }
  $scope.extraTopic1 = userSessionSettings.extraTopic1;
  $scope.extraTopic2 = userSessionSettings.extraTopic2;
  $scope.extraTopic3 = userSessionSettings.extraTopic3;
  $scope.saveProfile = function() {
  	userSessionSettings.topics = extractTopics()
  	userSessionSettings.extraTopic1 = $scope.extraTopic1;
  	userSessionSettings.extraTopic2 = $scope.extraTopic2;
  	userSessionSettings.extraTopic3 = $scope.extraTopic3;
  	userService.setSessionSettings(userSessionSettings).then(function() {
  		$location.path('/start/7')
  	})
  }
  var extractTopics = function() {
    return Object.keys($scope.selectedTopics);
  }
}
startTopicsController.$inject = ['$scope', '$location', 'sessionsService', 'userSessionSettings', 'userService'];
startTopicsController.$resolve = {
  userSessionSettings: ["userService", function(userService) {
    return userService.getSessionSettings();
  }]
}
export default startTopicsController;