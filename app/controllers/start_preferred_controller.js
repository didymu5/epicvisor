import moment from 'moment';
function startPreferredController($scope, $location, sessionsService,userSessionSettings,userService) {
   var days = sessionsService.getDayOptions();
   $scope.days = sessionsService.deduceDaySelectors(days, userSessionSettings);
   $scope.wipeDefaultTimes = function(day) {
    day.selectedStartTime = undefined;
    day.selectedEndTime = undefined;
  }
	$scope.saveProfile = function() {
		userSessionSettings.preferredTimeFrame = sessionsService.makePreferredTime($scope.days);
	 	if(timesNotValid(userSessionSettings.preferredTimeFrame)) {
		  $scope.sessionStatusText = "You have a start time that is after an end time. Please either blank out a day if not available or make valid timeframe."
		  return false;
		}
		userService.setSessionSettings(userSessionSettings).then(function() {
			$location.path('/start/6');
		});
	}	
	
}
 function timesNotValid(preferredTimes){
    var isInvalid = false;
    preferredTimes.forEach(function(time) {
      if(time.selectedStartTime && time.selectedEndTime) {
        if(moment(time.selectedStartTime.time).isAfter(moment(time.selectedEndTime.time))){
          isInvalid = true;
        }  
      }
    })
    return isInvalid;
  }
startPreferredController.$inject = ['$scope', '$location', 'sessionsService','userSessionSettings','userService'];
startPreferredController.$resolve = {
   userSessionSettings: ["userService", function(userService) {
    return userService.getSessionSettings();
  }]
};
export default startPreferredController;