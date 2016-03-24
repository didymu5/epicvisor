function profileSearchController($scope, userService, mentorService, $location) {
  userService.getUser().then(function(user) {
    $scope.user = user;
  })
  mentorService.getMentors().then(function(mentors) {
    $scope.mentors = mentors;
  })
  $scope.search = function() {
    mentorService.getMentors().then(function(mentors) {
      $scope.mentors = mentors;
    })
  }
  $scope.routeToMentor = function(mentor) {
    $location.path('/mentors/' + mentor.user_id);
  }
}
profileSearchController.$inject = ['$scope', 'userService', 'mentorService', '$location']
export default profileSearchController;