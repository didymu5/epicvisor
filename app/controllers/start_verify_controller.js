function startVerifyController($scope, $location, user, profile, userService) {
	$scope.years = userService.getSchoolYears();
	$scope.selectedYear = profile.year || "2019";
	$scope.blurb = profile.blurb || "";
	$scope.preferred_email = profile.preferred_email || user.email_address;
	$scope.saveProfile = function() {
		userService.setProfileSettings({
		  blurb: $scope.blurb,
		  year: $scope.selectedYear,
		        preferred_email: $scope.preferred_email
		}).then(function(userProfile) {
			$location.path("/start/4");
		});
	}
}
startVerifyController.$inject = ['$scope', '$location', 'user', 'profile', 'userService'];
startVerifyController.$resolve = {
	user: ['userService', function(userService) {
		return userService.getUser();
	}],
	profile: ['userService', function(userService) {
		return userService.getProfile();
	}]
}
export default startVerifyController;