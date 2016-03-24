function mentorDetailsController($scope, user, mentor, mentorSessions, sessionsService, $location) {
	$scope.user = user;
	$scope.mentor = mentor;
	$scope.mentorSessions = mentorSessions;
	$scope.bookSession = function(mentor, session){
		sessionsService.storeMentor(mentor);
		sessionsService.storeSession(session);
		$location.path('/session/book')
	}
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