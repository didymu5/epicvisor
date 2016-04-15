import _ from 'underscore';
function book_session_controller($scope, session, mentor, $location, sessionsService, myModal) {
	if(mentor === undefined) {
		$location.path('/');
		return;
	}
	$scope.years = Array.from(new Array(2019-1940), (x,i) => 2019-i);
	$scope.selectedYear = '2013';
	$scope.cancel = function() {
		$location.path('/mentors/' + mentor.user_id);
	}

	$scope.selectedTopics = {};
	function getMentorTopics(mentor){
		var possibleTopics = [mentor.extraTopic1, mentor.extraTopic2, mentor.extraTopic3].concat(mentor.topics);
		return possibleTopics;
	}
		$scope.session = session;
		$scope.avatar = mentor.avatar;
		$scope.mentorName = mentor.first_name + ' ' + mentor.last_name;
  	$scope.topics = ["Balancing Work/Life/School", "Choosing Electives" , "Internships as a FEMBA" , "Joining MBA Clubs" , "Being a Fly-in FEMBA" , "International FEMBA Trips"];
  	$scope.topics = $scope.topics.concat(getMentorTopics(mentor));
  	$scope.topics = _.compact(_.uniq($scope.topics));
  	function extractExtraTopics(){
  		return [$scope.extraTopic1, $scope.extraTopic2, $scope.extraTopic3].filter(function(topic){
  			return topic !== undefined;
  		});
  	}
	$scope.confirm = function() {
		myModal.deactivate();
		var name = $scope.name;
		var email = $scope.email;
		var year = $scope.selectedYear;
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
					myModal.activate({message: "An introduction has been made to this EpicVisor. Please check your email for more details.", closeBtnTxt:'Ok'});
					$location.path('/mentors/' + mentor.user_id);
				}
				else {
					myModal.activate({message: "Sorry only emails that have been invited to the UCLA Anderson / EpicVisor platform can request time with EpicVisors.", closeBtnTxt:'Ok'})
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