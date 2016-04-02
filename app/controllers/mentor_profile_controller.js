function mentorProfileController($scope, user, sessions, profile) {
	$scope.user = user;
	$scope.selectedYear = profile.year || "2016";
	$scope.blurb = profile.blurb || "";
	$scope.sessions = sessions;

	$scope.years = Array.from(new Array(2016-1940), (x,i) => 2016-i);
	$scope.saveProfile = function() {
		userService.setProfileSettings({
		  blurb: $scope.blurb,
		  year: $scope.selectedYear
		});
	}
}
mentorProfileController.$resolve = {
	user: ['userService', function(userService) {
		return userService.getUser();
	}],
	sessions: ['sessionsService', function(sessionsService) {
		return sessionsService.getSessions();
	}],
	profile: ['userService', function(userService) {
		return userService.getProfile();
	}]
}
mentorProfileController.$inject = ['$scope', 'user','sessions','profile'];
export default mentorProfileController;