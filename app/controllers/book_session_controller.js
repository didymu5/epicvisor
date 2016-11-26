import _ from 'underscore';
import moment from 'moment';
/**
 * Book Session Controller
 */
function book_session_controller($scope, session, mentor, $location, sessionsService, myModal) {
	$scope.sessionWhatever = "PERO ";
	if (mentor === undefined) {
		$location.path('/');
		return;
	}

	$scope.allAvailableTimes = sessionsService.deduceTimeframes(mentor).map(function(time) {
		return {
			formattedTime: time.format("MMMM Do, h:mm a z"),
			time: time
		}
	});

	/**
	 * Times to be populated in dropdown selected
	 * these are dynamically generated base on
	 * createSessionTimesListener method
	 * @type {Object}
	 */
	$scope.timeOptions = {
		session1: [],
		session2: [],
		session3: []
	};

	/**
	 * Set up Listeners
	 */
	['session1', 'session2', 'session3'].forEach(createSessionTimesListener);

	$scope.selectedOptionDay1 = undefined;
	$scope.selectedOptionDay2 = undefined;
	$scope.selectedOptionDay3 = undefined;
	$scope.years = Array.from(new Array(2019-1940), (x,i) => 2019-i);
	$scope.selectedYear = '2019';

	$scope.cancel = function() {
		$location.path('/mentors/' + mentor.user_id);
	}

	$scope.selectedTopics = {};

	function getMentorTopics(mentor) {
		var possibleTopics = [mentor.extraTopic1, mentor.extraTopic2, mentor.extraTopic3].concat(mentor.topics);
		return possibleTopics;
	}

	$scope.session = session;
	$scope.avatar = mentor.avatar;
	$scope.mentorName = mentor.first_name + ' ' + mentor.last_name;
	$scope.topics = [];
  	$scope.topics = $scope.topics.concat(getMentorTopics(mentor));
  	$scope.topics = _.compact(_.uniq($scope.topics));

  	function extractExtraTopics() {
  		return [$scope.extraTopic1, $scope.extraTopic2, $scope.extraTopic3].filter(function(topic){
  			return topic !== undefined;
  		});
  	}

	$scope.confirm = function() {
		myModal.deactivate();
		var session = {};
		var name = $scope.name;
		var email = $scope.email;
		var year = $scope.selectedYear;
		session.topics =  Object.keys($scope.selectedTopics).filter(function(topic) {
			return $scope.selectedTopics[topic];
		});
		var possibleTimes = [$scope.session1_time, $scope.session2_time, $scope.session3_time]
		// Slightly redudant, will fix
		session.SessionTimeOption = possibleTimes.map(function(time) {
			if (time) {
				return time.time.toDate();
			}
		});
		session.topics = session.topics.concat(extractExtraTopics());
		sessionsService.confirmSession(session, mentor, {
			name: name,
			year: year,
			email: email
		})
		.then(function(confirmation) {
			if (confirmation) {
				myModal.activate({message: "An introduction has been made to this EpicVisor. Please check your anderson email for more details.", closeBtnTxt:'Ok'});
				$location.path('/mentors/' + mentor.user_id);
			} else {
				myModal.activate({message: "During this beta, only UCLA Anderson emails can book sessions.", closeBtnTxt:'Ok'})
			}
			return undefined;
		});
	}

	/**
	 * Constraints to limit particular modules IE: Datepicker
	 * @type {Object}
	 */
	$scope.constraints = {
		maxDate: getMaxDate(40).toString(),
		minDate: getMinDay().toString(),
		defaultDate: new Date().toString(),
		// Create a list of disabled dates
		disabledDates: getDisabledDates()
	};

	function getDisabledDates() {
		var timesByWeekDay = _.groupBy($scope.allAvailableTimes, function(time) {
			return time.time.format('e')
		})
		var startDate = moment(getMinDay()).startOf('day');
		var endDate = moment(getMaxDate(40));
		var disabledDates = []
		while(startDate.isBefore(endDate)) {
			var day = startDate.format('e');
			if(!timesByWeekDay[day]) {
				disabledDates.push(startDate.toDate());
			}
			startDate = startDate.add('1','day')
		}
		return disabledDates;
	}

	function getMinDay() {
		return new Date();
	}

     // bug with date picker, despite 4 weeks in advance, it has to fill up the entire week for it to show
	function getMaxDate(numDays) {
		var tempDate = new Date();
		return new Date(tempDate.setDate(tempDate.getDate() + numDays));
	}

	function createSessionTimesListener(sessionNumber) {
		var watchedModel = sessionNumber + '.date';

		$scope.$watch(watchedModel, function (newValue, oldValue) {
			if (newValue !== oldValue) {
				$scope.timeOptions[sessionNumber] = _($scope.allAvailableTimes)
														.filter(matchMonth)
														.map(addLabelForTime);
			}

			/**
			 * Match selected month with items in the array
			 * @param  {object} timeObject the time object within the generated array of sessions
			 * @return {array}            filtered array of sessions
			 */
			function matchMonth(timeObject) {
				var selectedDay = new Date(newValue).getDay();
				return (selectedDay === timeObject.time.day());
			}

			/**
			 * Add an extra key to the object for labels in the dropdown
			 * @param {object} timeObject the time object within the array
			 */
			function addLabelForTime(timeObject) {
				timeObject.label = timeObject.time.format('LT (PT)');
				return timeObject;
			}
		});
	}

	// Model format
	$scope.model = {
		session: {
			date: '',
			time: ''
		}
	};

	// Create session model and inherit properties of
	// model/class definition
	$scope.session1 = _.extend($scope.session1, $scope.model.session);
	$scope.session2 = _.extend($scope.session2, $scope.model.session);
	$scope.session3 = _.extend($scope.session3, $scope.model.session);
}

book_session_controller.$resolve = {
	session: ['sessionsService', function(sessionsService) {
		return sessionsService.getCurrentSession();
	}],
	mentor: ['sessionsService', function(sessionsService) {
		return sessionsService.getSessionMentor();
	}]
}

/**
 * Injections
 */
book_session_controller.$inject = ['$scope','session','mentor','$location', 'sessionsService', 'myModal'];

export default book_session_controller;
