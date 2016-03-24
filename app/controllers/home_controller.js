function homeController($scope, userService) {
  userService.getUser().then(function(user) {
    if(user) {
      $scope.user = user;
    }
  });
}
homeController.$inject = ['$scope', 'userService'];
export default homeController;