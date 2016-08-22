import _ from 'underscore';
function book_session_controller($scope, session, mentor, $location, sessionsService, myModal) {
	if(mentor === undefined) {
		$location.path('/');
		return;
	}
	$scope.allAvailableTimes = sessionsService.deduceTimeframes(mentor).map(function(time) {
		return {
			formattedTime: time.format("MMMM Do, h:mm a"),
			time: time
		}
	})
	$scope.selectedOptionDay1 = undefined;
	$scope.selectedOptionDay2 = undefined;
	$scope.selectedOptionDay3 = undefined;
	$scope.years = Array.from(new Array(2019-1940), (x,i) => 2019-i);
	$scope.selectedYear = '2019';
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
		$scope.topics = [];
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
		var possibleTimes = [$scope.selectedOptionDay1, $scope.selectedOptionDay2,$scope.selectedOptionDay3]
		session.SessionTimeOption = possibleTimes.map(function(time) {
			if(time) {
				return time.time.toDate();
			}
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