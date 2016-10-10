function startAboutController($scope, $location, userService	) {
	$scope.syncLinkedIn = function() {
		userService.refreshLinkedIn().then(function(data){
			$location.path('/start/3');
		});
	}	
}
startAboutController.$inject = ['$scope', '$location', 'userService'];
export default startAboutController;