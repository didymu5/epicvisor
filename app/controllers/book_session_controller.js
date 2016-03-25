function book_session_controller($scope, session, mentor, $location, sessionsService) {
	$scope.cancel = function() {
		$location.path('/mentors/' + mentor.id);
	}
	$scope.selectedTopics = {};
  	$scope.topics = ["Career Advancement", "Building a Team","Internships","International Business","Raising Funding","Work Life Balance"];
	$scope.confirm = function() {
		var name = $scope.name;
		var email = $scope.email;
		var year = $scope.year;
		session.topics =  Object.keys($scope.selectedTopics).filter(function(topic) {
			return $scope.selectedTopics[topic];
		});
		session.extraTopic = $scope.extraTopic;
		sessionsService.confirmSession(session, mentor,
			{
				name: name,
				year: year,
				email: email
			}).then(function(confirmation) {
				if(confirmation){
					$location.path('/');
				}
				else {
					$scope.error = "Incorrect key?"
				}
				return undefined;
		});
	}
}
book_session_controller.$resolve = {
	session: ['sessionsService', function(sessionsService) {
		return sessionsService.getSession();
	}],
	mentor: ['sessionsService', function(sessionsService) {
		return sessionsService.getSessionMentor();
	}]
}
book_session_controller.$inject = ['$scope','session','mentor','$location', 'sessionsService'];

export default book_session_controller;