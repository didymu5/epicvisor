function adminMentorsController($scope,user, $location, users) {
	if(user.role !== 'admin')
	{
		$location.path('/');
	}
	$scope.users = users;
}
adminMentorsController.$resolve = {
	users: ['sessionsService', function(sessionsService){
		return sessionsService.getMentorsAndSessions();
	}],
	user: ['userService', function(userService){
		return userService.getUser();
	}]
}
adminMentorsController.$inject = ['$scope','user','$location','users'];
export default adminMentorsController;