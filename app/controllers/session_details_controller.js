import moment from 'moment';
function sessionDetailsController($scope, session, sessionsService) {
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
	function matchDay(selectedTime, times, defaultIndex) {
		return times.filter(function(time) {
			return moment(time.date || time.time).isSame(moment(selectedTime));
		})[0] || times[0 || defaultIndex];
	}
	$scope.selectedDay = matchDay(session.day, $scope.days);
	$scope.selectedStartTime = matchDay(session.startTime, $scope.startTimes);
	$scope.selectedEndTime = matchDay(session.endTime, $scope.endTimes, 2);
	$scope.confirm = function() {
		sessionsService.confirmTime(session, $scope.selectedDay.date, $scope.selectedStartTime.time, $scope.selectedEndTime.time).then(function(session) {
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
			$scope.status = "Deleted!";
		});
	};

}
sessionDetailsController.$resolve = {
	session: ['sessionsService', '$route', function(sessionsService, $route) {
		return sessionsService.getSession($route.current.params.session_id);
	}]
}
sessionDetailsController.$inject = ['$scope','session', 'sessionsService'];
export default sessionDetailsController;