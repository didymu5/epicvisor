function applicationController($scope, userService, $route) {
  userService.getUser().then(function(user) {
    $scope.user = user;
  });
  $scope.signedIn = function() {
    return $scope.user;
  }
  var whitelistedControllers = ["MentorDetailsController", "ProfileSearchController", "BookSessionController"];
  $scope.notNecessaryToSignIn = function() {
  	return $route.current && $route.current.$$route && whitelistedControllers.indexOf($route.current.$$route.controller) > -1;
  }
}

applicationController.$inject = ['$scope', 'userService', '$route'];
export default applicationController;