import moment from 'moment';

function mentorDetailsController($scope, user, mentor, mentorSessions, sessionsService, $location) {
	$scope.user = user;
	$scope.mentor = mentor;
	$scope.mentorSessions = mentorSessions;
	$scope.bookSession = function(session, mentor){
		sessionsService.storeMentor(mentor);
		sessionsService.storeSession(session);
		$location.path('/mentor/sessions/confirm')
	}

	$scope.month1 = moment().format('MMMM');
	$scope.month2 = moment().add(4, 'w').format('MMMM')
}
mentorDetailsController.$resolve = {
	user: ['userService', function(userService) {
		return userService.getUser();
	}],
	mentor: ['mentorService','$route', function(mentorService, $route) {
		return mentorService.getMentor($route.current.params.mentor_id);
	}],
	mentorSessions: ['sessionsService', '$route', function(sessionsService, $route) {
		return sessionsService.getMentorSessions($route.current.params.mentor_id)
	}]
}
mentorDetailsController.$inject = ['$scope', 'user','mentor', 'mentorSessions', 'sessionsService', '$location']
export default mentorDetailsController;
