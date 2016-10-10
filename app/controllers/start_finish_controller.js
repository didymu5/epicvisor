function startFinishController($scope, $location) {
	$scope.goToProfile = function() {
		$location.path('/profile')
	}
	
}
startFinishController.$inject = ['$scope', '$location'];
export default startFinishController;