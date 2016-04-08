function book_session_controller($scope, session, mentor, $location, sessionsService, myModal) {
	if(mentor === undefined) {
		$location.path('/')
	}
	$scope.cancel = function() {
		$location.path('/mentors/' + mentor.uid);
	}
	$scope.selectedTopics = {};
  	$scope.topics = ["Career Advancement", "Building a Team","Internships","International Business","Raising Funding","Work Life Balance"];
  	function extractExtraTopics(){
  		return [$scope.extraTopic1, $scope.extraTopic2, $scope.extraTopic3].filter(function(topic){
  			return topic !== undefined;
  		});
  	}
	$scope.confirm = function() {
		myModal.deactivate();
		var name = $scope.name;
		var email = $scope.email;
		var year = $scope.year;
		session.topics =  Object.keys($scope.selectedTopics).filter(function(topic) {
			return $scope.selectedTopics[topic];
		});
		session.topics = session.topics.concat(extractExtraTopics());
		sessionsService.confirmSession(session, mentor,
			{
				name: name,
				year: year,
				email: email
			}).then(function(confirmation) {
				if(confirmation){
					myModal.activate({message: " An intro has been made with this EpicVisor. Please follow email instructions. "})
					$location.path('/mentors/' + mentor.user_id);
				}
				else {
					myModal.activate({message: "That's not the right email/username for this site. Please contact customer support for more information."})
				}
				return undefined;
		});
	}
}
book_session_controller.$resolve = {
	session: ['sessionsService', function(sessionsService) {
		return sessionsService.getCurrentSession();
	}],
	mentor: ['sessionsService', function(sessionsService) {
		return sessionsService.getSessionMentor();
	}]
}
book_session_controller.$inject = ['$scope','session','mentor','$location', 'sessionsService', 'myModal'];

export default book_session_controller;