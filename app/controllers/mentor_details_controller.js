import moment from 'moment';

function mentorDetailsController($scope, user, mentor, mentorSessions, sessionsService, $location) {
	$scope.user = user;
	$scope.mentor = mentor;
	$scope.mentorSessions = mentorSessions.sessionsByMonth;
	$scope.bookSession = function(session, mentor){
		sessionsService.storeMentor(mentor);
		sessionsService.storeSession(session);
		$location.path('/mentor/sessions/confirm')
	}

	$scope.maxSessionsPerMonth = mentorSessions.sessionCount;

	$scope.getSessionsCount = function(month_year) {
		var sessionsThisMonth = ($scope.mentorSessions[month_year] || []).length;
		return $scope.maxSessionsPerMonth - sessionsThisMonth;
	}

	$scope.month1 = moment().format('MMMM YYYY');
	$scope.month2 = moment().add(1, 'month').format('MMMM YYYY')
}
mentorDetailsController.$resolve = {
	user: ['userService', function(userService) {
		return userService.getUser();
	}],
	mentor: ['mentorService','$route', function(mentorService, $route) {
		return mentorService.getMentor($route.current.params.mentor_id);
	}],
	mentorSessions: ['sessionsService', '$route', function(sessionsService, $route) {
		return sessionsService.getMentorSessionsByMonth($route.current.params.mentor_id)
	}]
}
mentorDetailsController.$inject = ['$scope', 'user','mentor', 'mentorSessions', 'sessionsService', '$location']
export default mentorDetailsController;
