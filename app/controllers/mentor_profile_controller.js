function mentorProfileController($scope, userService) {
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
}
mentorProfileController.$inject = ['$scope', 'userService'];
export default mentorProfileController;