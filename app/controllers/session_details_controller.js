import moment from 'moment';
function sessionDetailsController($scope, session, sessionsService, $location) {
	$scope.session = session;
	$scope.mentor = session.mentor;
	$scope.student = session.student;
	function makeTimes() {
		var times = [];
		for(var i=0; i<48; i++) {
			var time = moment().startOf('day').add(i*30, 'minutes');
			times.push({time: time.toDate(), formattedTime: time.format("h:mm a")});
		}
		return times;
	}
	function makeDays(date) {
		var times = [];
		for(var i=0; i<30; i++) {
			var day = moment(date).add(i,'days').startOf('day');
			times.push({date: day.toDate(), formattedDate: day.format("MM/DD")});
		}
		return times;
	}
	$scope.days = makeDays(session.date);
	$scope.startTimes = makeTimes();
	$scope.endTimes = makeTimes();
	function matchDay(selectedTime, times, comparator, defaultIndex) {
		return times.filter(function(time) {
			return comparator(moment(time.date || time.time), moment(selectedTime));
		})[0] || times[0 || defaultIndex];
	}
	function compareDays(day1, day2) {
		return day1.isSame(day2, 'day');
	}
	function compareTimeOfDay(day1, day2) {
		return day1.hours() === day2.hours() && day1.minutes() === day2.minutes();
	}
	$scope.selectedDay = matchDay(session.day, $scope.days, compareDays);
	$scope.selectedStartTime = matchDay(session.startTime, $scope.startTimes, compareTimeOfDay);
	$scope.selectedEndTime = matchDay(session.endTime, $scope.endTimes, compareTimeOfDay,2);
	$scope.confirm = function() {
		var selectedDay = moment($scope.selectedDay.date).dayOfYear();
		var selectedStart = moment($scope.selectedStartTime.time).dayOfYear(selectedDay).toDate();
		var selectedEnd = moment($scope.selectedEndTime.time).dayOfYear(selectedDay).toDate(); 
		sessionsService.confirmTime(session, $scope.selectedDay.date, selectedStart, selectedEnd).then(function(session) {
				$scope.status = "Confirmed!"
		});
	};
	$scope.canConfirm = function() {

	}
	$scope.isPending = function(session) {
		return session.status === "pending";
	}
	$scope.cancel = function() {
		sessionsService.cancelTime(session, $scope.selectedDay, $scope.selectedStartTime, $scope.selectedEndTime).then(function(session) {
			myModal.activate({message: "Your EpicSession has been cancelled."})
			$location.path("/");
		});
	};

}
sessionDetailsController.$resolve = {
	session: ['sessionsService', '$route', function(sessionsService, $route) {
		return sessionsService.getSession($route.current.params.session_id);
	}]
}
sessionDetailsController.$inject = ['$scope','session', 'sessionsService', '$location'];
export default sessionDetailsController;