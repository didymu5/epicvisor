import moment from 'moment';

function sessionsService($http, userService, mentorService) {
	function makeSessions(sessions, sessionState) {
	    var numberOfSessionsToGenerate = sessionState.sessionCount;
	    for(var week=0; week <4; week++) {
	      for(var sessionNumber=0; sessionNumber<numberOfSessionsToGenerate; sessionNumber++) {
	        sessions.push({
	          date: moment().add(week, 'week'),
	          number: sessionNumber+1,
	          status: 'Open'
	        })
	      }
	    }
	    return sessions;
	  }
	return {
		 getSessions: function() {
      var self = this;
      return $http.get('/sessions/user').then(function(res) {
        var sessions = res.data;
        return self.getSessionSettings().then(function(sessionState) {       
          return makeSessions(sessions, sessionState);
        })
      });
    },
    getMentorSessions: function(mentorId) {
		var self = this;
		  return $http.get('/mentor/' + mentorId + '/sessions').then(function(res) {
		    var sessions = res.data;
		    return mentorService.getMentorSettings(mentorId).then(function(sessionState) {       
		      return makeSessions(sessions, sessionState);
		    })
		  });
    }
	};
}

sessionsService.$inject =['$http', 'userService','mentorService'];
export default sessionsService;