function book_session_controller($scope, session, mentor, $location, sessionsService) {
	$scope.cancel = function() {
		$location.path('/mentors/' + mentor.id);
	}
  	$scope.topics = ["Career Advancement", "Building a Team","Internships","International Business","Raising Funding","Work Life Balance"];
	$scope.confirm = function() {
		var name = $scope.name;
		var email = $scope.email;
		var year = $scope.year;
		var topics =  Object.keys($scope.selectedTopics)
		var extraTopic = $scope.extraTopic;
		sessionsService.confirmSession(session, mentor).then(function(confirmation) {
			$location.path('/');
		});
	}
}
book_session_controller.$inject = ['$scope','session','mentor','$location', 'sessionsService'];
book_session_controller.$resolve = {
	session: ['sessionsService', function(sessionsService) {
		return sessionsService.getSession();
	}],
	mentor: ['sessionsService', function(sessionsService) {
		return sessionsService.getSessionMentor();
	}]
}