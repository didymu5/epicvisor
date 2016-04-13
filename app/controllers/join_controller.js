function joinController($scope, $location) {
  
  if ($location.search()['9aa228a3f6d2958438eae5d3d40fb348']) {
    $scope.linkedInButton = "button"
  } else {
    $scope.sorry_message = 'The EpicVisor / UCLA Anderson platform is in Private Beta and requires an invitation';
  }
}
joinController.$inject = ['$scope', '$location'];
export default joinController;