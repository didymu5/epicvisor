import moment from 'moment';

function mentorProfileController($scope, user, sessions, profile, userService, $location, myModal) {
	$scope.user = user;
	$scope.selectedYear = profile.year || "2019";
	$scope.blurb = profile.blurb || "";
	$scope.sessions = sessions;
	$scope.preferred_email = profile.preferred_email || user.email_address;

	$scope.decorateExpirationTime = function(session) {
		if(session.status === "pending") {
			return moment(session.createdAt).add('2','days').startOf('day').toDate();
		}
		else {
			return '';
		}
	}

	$scope.years = Array.from(new Array(2019-1940), (x,i) => 2019-i);
	$scope.saveProfile = function() {
		userService.setProfileSettings({
		  blurb: $scope.blurb,
		  year: $scope.selectedYear,
		        preferred_email: $scope.preferred_email
		}).then(function(userProfile) {
			$location.path('/profile/sessions');
		});
	}
	$scope.viewUserProfile = function() {
		$location.path('/mentors/'+user.id);
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