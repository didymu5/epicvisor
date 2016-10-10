function applicationController($scope, userService, $route) {
  userService.getUser().then(function(user) {
    $scope.user = user;
  });
  $scope.signedIn = function() {
    return $scope.user;
  }

  var whitelistedControllers = ["MentorDetailsController","SessionDetailsController", "ProfileSearchController", "BookSessionController", "JoinController", "StartAboutController", "StartSyncController"];

  $scope.notNecessaryToSignIn = function() {
  	return $scope.currentRoute() && whitelistedControllers.indexOf($route.current.$$route.controller) > -1;
  }
  $scope.currentRoute = function() {
    return $route.current && $route.current.$$route
  }
}

applicationController.$inject = ['$scope', 'userService', '$route'];
export default applicationController;