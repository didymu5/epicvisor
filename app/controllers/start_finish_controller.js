function startFinishController($scope, $location,user) {
	$scope.goToProfile = function() {
		$location.path('/mentors/' + user.id)
	}
	
}
startFinishController.$inject = ['$scope', '$location', 'user'];
startFinishController.$resolve = {
	user: ['userService', function(userService) {
		return userService.getUser();
	}]
}
export default startFinishController;