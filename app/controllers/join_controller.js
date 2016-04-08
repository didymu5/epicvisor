function joinController($scope, $location) {
  
  if ($location.search()['9aa228a3f6d2958438eae5d3d40fb348']) {
    $scope.linkedInButton = "button"
  } else {
    $location.url('');
  }
}
joinController.$inject = ['$scope', '$location'];
export default joinController;