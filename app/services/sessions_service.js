import moment from 'moment';
import _ from 'underscore';
function sessionsService($http, userService, mentorService, $q, studentService) {
	var sessionState = {};
   
	function makeSessions(sessions, sessionState) {
        var numberOfSessionsToGenerate = sessionState.sessionCount;
        var sessionsByWeek = _.groupBy(sessions, function(session) {
            return moment(session.date).startOf('week').startOf('day');
        });
        var orderedSessions = [];
        var weeks = _.keys(sessionsByWeek);
        for(var i=0; i< 4; i++) {
            var currentWeek = moment().add('weeks', i).startOf('day');
            var match = _.find(weeks, function(week) {
                return moment(week).isSame(currentWeek,'week');
            });
            if(!match) {
                sessionsByWeek[currentWeek.startOf('week').toString()] = [];
                weeks.push(currentWeek.startOf('week').toString());
            }
        }
        _.sortBy(weeks, function(week) {
            return moment(week).toDate().getTime();
        }).forEach(function(week) {
            var sessionsForWeek = sessionsByWeek[week];

            for(var sessionNumber =sessionsForWeek.length; sessionNumber < numberOfSessionsToGenerate; sessionNumber++ )
            {
              sessionsForWeek.push({
                    date: moment(week).toDate(),
                  number: sessionNumber+1,
                  status: 'Open'
                })
            }
            orderedSessions = orderedSessions.concat(sessionsForWeek);
        });
	    return orderedSessions.map(function(session) {
            session.date = moment(session.date).startOf('week').toDate();
            return session;
        });
	  }
	return {
        makeSessions: makeSessions,
		 getSessions: function() {
      var self = this;
      return $http.get('/sessions/user').then(function(res) {
        var sessions = res.data;
        return userService.getSessionSettings().then(function(sessionState) {       
          return makeSessions(sessions, sessionState);
        })
      });
    },
    getSession: function(sessionid) {
        return $http.get('/sessions/' + sessionid).then(function(res) {
            var session = res.data;
            var mentorId = session.user_id;
            var studentId = session.student_id;
            return $q.all([mentorService.getMentor(mentorId), studentService.getStudent(studentId)])
            .then(function(results) {
                session.mentor = results[0];
                session.student = results[1];
                return session;
            });
        });

    },
    confirmTime: function(session, day, startTime, endTime) {
        return $http.post('/sessions/' + session.id + '/update', 
        {
            data: {
                day: day,
                startTime: startTime,
                endTime: endTime
            }
        }).then(function(res) {
            return res.data;
        });
    },
    cancelTime: function(session) {
        return $http.post('/sessions/' + session.id + '/delete').then(function(res){
            return res.data;
        });
    },
    storeMentor: function(mentor) {
    	sessionState.mentor = mentor;
    },
    storeSession: function(session) {
    	sessionState.session = session;
    },
    getCurrentSession: function() {
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
    			return $http.post('/mentor/' + mentor.user_id +  '/sessions/appointment', 
                    session).then(function(session) {
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

sessionsService.$inject =['$http', 'userService','mentorService', '$q', 'studentService'];
export default sessionsService;