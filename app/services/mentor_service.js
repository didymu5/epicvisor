function mentorService($http) {
  return {
    getMentors: function(){
      return $http.get('/mentors').then(function(res) {
        var mentors = res.data;
        mentors.map(function(mentor) {
          var latestPosition = mentor.positions && mentor.positions.values && mentor.positions.values[0];
          // var latestPosition = mentor.positions && mentor.positions.values[0];
          if(latestPosition)
          {
            mentor.position = latestPosition.title + ", " + latestPosition.company.name
          }
          return mentor;
        });
        return res.data;
      });
    },
    getMentor: function(mentorId) {
    	return $http.get('/mentors/' + mentorId).then(function(res) {
    		var mentor = res.data;
    		var latestPosition = mentor.positions && mentor.positions.values[0];
          if(latestPosition)
          {
            mentor.position = latestPosition.title + ", " + latestPosition.company.name
          }
          return mentor;	
    	});
    },
    getMentorSettings: function(mentorId) {
      return $http.get('/mentor/' + mentorId +  '/settings/session').then(function(res) {
        return res.data;
      });
    }
  }
}
mentorService.$inject = ["$http"];
export default mentorService;