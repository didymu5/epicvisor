import _ from 'underscore';
function profileSearchController($scope, user, mentors, $location, mentorService) {
  $scope.user = user;
  var industries = _.uniq(mentors.map(function(mentor){ return mentor.industry}));
  $scope.industries = industries.map(function(industry) {
    return {
      ticked: false,
      name: industry
    }
  });
  var companies = _.uniq(mentors.map(function(mentor) {
    return mentor.positions && mentor.positions.values && mentor.positions.values[0].company.name
  }))
  companies = _.filter(companies, function(company) { return company !== undefined});
  $scope.companies = companies.map(function(company) {
    return {
      ticked: false,
      name: company
    }
  });

  var fields = _.uniq(_.flatten(mentors.map(function(mentor) {
    return mentor.career_topics || [];
  })));
  $scope.fields = fields.map(function(field) {
    return {
      ticked: false,
      name: field
    }
  });

  $scope.mentors = mentors;
  $scope.search = function() {
    mentorService.getMentors().then(function(mentors) {
      $scope.mentors = mentors;
    })
  }
  $scope.routeToMentor = function(mentor) {
    $location.path('/mentors/' + mentor.user_id);
  }
  $scope.showFilter = true;
  $scope.filterExpandCollapse = "collapse";
  $scope.expandOrCollapse = function() {
    $scope.showFilter = !$scope.showFilter;
    $scope.filterExpandCollapse = $scope.showFilter ? "collapse" : "expand";
  }

}
profileSearchController.$resolve = {
  user: ['userService', function(userService) {
    return userService.getUser();
  }],
  mentors: ['mentorService', function(mentorService) {
    return mentorService.getMentors();
  }]
};
profileSearchController.$inject = ['$scope', 'user', 'mentors', '$location', 'mentorService']
export default profileSearchController;