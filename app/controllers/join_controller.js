function joinController($scope, $location) {

  if ($location.search()['epemba']) {
    console.log('hi');
    $scope.linkedInButton = "button"
  };
}
joinController.$inject = ['$scope', '$location'];
export default joinController;