function mentorProfileController($scope, user, sessions, profile, userService, $location) {
	$scope.user = user;
	$scope.selectedYear = profile.year || "2016";
	$scope.blurb = profile.blurb || "";
	$scope.sessions = sessions;
	$scope.selectedYear = '2013';

	$scope.years = Array.from(new Array(2016-1940), (x,i) => 2016-i);
	$scope.saveProfile = function() {
		userService.setProfileSettings({
		  blurb: $scope.blurb,
		  year: $scope.selectedYear
		}).then(function(userProfile) {
			$location.path('/mentors/' + user.id);
		});
	}
	$scope.hasSetupSessions = function(){
		return $scope.sessions.length > 0;
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
mentorProfileController.$inject = ['$scope', 'user','sessions','profile', 'userService', '$location'];
export default mentorProfileController;