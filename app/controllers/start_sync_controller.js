function startSyncController($scope, $location, userService	) {
	$scope.syncLinkedIn = function() {
		userService.refreshLinkedIn().then(function(data){
			$location.path('/start/3');
		});
	}	
}
startSyncController.$inject = ['$scope', '$location', 'userService'];
export default startSyncController;