import _ from 'underscore';
function profileSearchController($scope, user, mentors, $location, mentorService) {
  $scope.user = user;
  var allMentors = mentors;
    function getMentorCompany(mentor) {
    return mentor.positions && mentor.positions.values && mentor.positions.values[0].company.name;
  }
  function getIndustryCompany(mentor) {
    return mentor.industry;
  }
  function getCareerTopics(mentor) {
    return mentor.career_topics;
  }
  var industries = _.compact(_.uniq(mentors.map(getIndustryCompany)));
  $scope.industries = industries.map(function(industry) {
    return {
      ticked: false,
      name: industry
    }
  });

  var companies = _.compact(_.uniq(mentors.map(getMentorCompany)));
  companies = _.filter(companies, function(company) { return company !== undefined});
  $scope.companies = companies.map(function(company) {
    return {
      ticked: false,
      name: company
    }
  });

  var fields = _.compact(_.uniq(_.flatten(mentors.map(getCareerTopics))));
  $scope.fields = fields.map(function(field) {
    return {
      ticked: false,
      name: field
    }
  });

  $scope.mentors = mentors;
  $scope.search = function() {
    var filteredMentors = allMentors;
    if($scope.selectedIndustries.length >0 ) {
      filteredMentors = filteredMentors.filter(function(mentor) {
        return _.map($scope.selectedIndustries, 'name').indexOf(mentor.industry) !== -1;
      });
    }
    if($scope.selectedField.length > 0) {
      filteredMentors = filteredMentors.filter(function(mentor) {
        var names = _.map($scope.selectedField, 'name');
        var fields = getCareerTopics(mentor)
        return _.union(fields, names).length > 0;
      });
    }
    if($scope.selectedCompanies.length > 0) {
      filteredMentors = filteredMentors.filter(function(mentor) {
        return _.map($scope.selectedCompanies, 'name').indexOf(getMentorCompany(mentor)) !== -1;
      });
    }
    $scope.mentors = filteredMentors;
  }
  $scope.routeToMentor = function(mentor) {
    $location.path('/mentors/' + mentor.uid);
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