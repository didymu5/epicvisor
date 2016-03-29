function sessionDetailsController($scope, session) {
	$scope.session = session;
	$scope.mentor = session.mentor;
	$scope.student = session.student;

}
sessionDetailsController.$resolve = {
	session: ['sessionsService', '$route', function(sessionsService, $route) {
		return sessionsService.getSession($route.current.params.session_id);
	}]
}
sessionDetailsController.$inject = ['$scope','session'];
export default sessionDetailsController;