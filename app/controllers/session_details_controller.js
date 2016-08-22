import moment from 'moment';

function sessionDetailsController($scope, session, sessionsService, $location, myModal) {
	if (!session) {
		$location.path('/');
	}
	$scope.session = session;
	$scope.mentor = session.mentor;
	$scope.student = session.student;


	$scope.timesToPickFrom = session.SessionTimeOption.map(function(time) {
		return {
			time: time,
			formattedTime: time.format("MMMM Do, h:mm a")
		}
	});

	$scope.selectedBookingTime = $scope.timesToPickFrom.find(function(date) {
		return date.time.isSame(	moment(session.startTime));
	});

	function makeTimes() {
		var times = [];
		for (var i = 0; i < 48; i++) {
			var time = moment().startOf('day').add(i * 30, 'minutes');
			times.push({
				time: time.toDate(),
				formattedTime: time.format("h:mm a")
			});
		}
		return times;
	}

	function makeDays(date) {
		var times = [];
		var startDay = moment(date).startOf('week').startOf('day');
		var endDay = moment(date).endOf('week').endOf('day');
		var day = startDay;
		while (day.isBefore(endDay)) {
			times.push({
				date: day.toDate(),
				formattedDate: day.format("MM/DD")
			});
			day = day.clone().add(1, 'days');
		}
		return times;
	}
	$scope.days = makeDays(session.date);
	$scope.startTimes = makeTimes();
	$scope.endTimes = makeTimes();

	function matchDay(selectedTime, times, comparator, defaultIndex) {
		return times.filter(function(time) {
			return comparator(moment(time.date || time.time), moment(selectedTime).startOf('day'));
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
	$scope.selectedEndTime = matchDay(session.endTime, $scope.endTimes, compareTimeOfDay, 2);
	$scope.confirm = function() {

		if(!$scope.selectedBookingTime)
		{
			$scope.status = "You need to select a booking time!";
			return;
		}

		var selectedStartTime = $scope.selectedBookingTime.time;

		var selectedDay = selectedStartTime.dayOfYear();
		var selectedStart = selectedStartTime.toDate();
		var selectedEnd = selectedStartTime.clone().add(30, 'minutes').toDate();

		sessionsService.confirmTime(session, selectedDay, selectedStart, selectedEnd).then(function(session) {
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
			myModal.activate({
				message: "Your EpicSession has been cancelled.",
				closeBtnTxt: 'ok =('
			})
			$location.path("/");
		});
	};

}
sessionDetailsController.$resolve = {
	session: ['sessionsService', '$route', function(sessionsService, $route) {
		return sessionsService.getSession($route.current.params.session_id).catch(function(err) {
			return undefined;
		});
	}]
}
sessionDetailsController.$inject = ['$scope', 'session', 'sessionsService', '$location', 'myModal'];
export default sessionDetailsController;