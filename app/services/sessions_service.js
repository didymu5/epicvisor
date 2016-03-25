import moment from 'moment';
function sessionsService($http, userService, mentorService) {
	var sessionState = {};
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
    storeMentor: function(mentor) {
    	sessionState.mentor = mentor;
    },
    storeSession: function(session) {
    	sessionState.session = session
    },
    getSession: function() {
    	return sessionState.session;
    },
    getSessionMentor: function(){
    	return sessionState.mentor;
    },
    confirmSession: function(session, mentor, student) {
    	return $http.post('/student/verify', {data: student}).then(function(res) {
            var studentData = res.data;
    		if(studentData) {
                session.student_id = studentData.id;
                session.status = 'pending';
    			return $http.post('/mentor/' + mentor.id +  '/sessions/appointment', 
                    {data: session}).then(function(session) {
                        return true;
                    })
    		}
    		else {
    			return false;
    		}
    	})
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