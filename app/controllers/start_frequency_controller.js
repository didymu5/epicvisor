function startFrequencyController($scope, $location, user, userSessionSettings, userService) {
	$scope.sessionCounts = userService.getSessionCountOptions();
	$scope.selectedSessionCount = userSessionSettings.sessionCount || $scope.sessionCounts[0];
	$scope.saveProfile = function() {
		userSessionSettings.sessionCount = $scope.selectedSessionCount;
		userService.setSessionSettings(userSessionSettings).then(function() {
			$location.path('/start/5');
		});
	}	
}
startFrequencyController.$inject = ['$scope', '$location', 'user', 'userSessionSettings', 'userService'];
startFrequencyController.$resolve = {
  user: ["userService", function(userService) {
    return userService.getUser();
  }],
  userSessionSettings: ["userService", function(userService) {
    return userService.getSessionSettings();
  }]
}
export default startFrequencyController;