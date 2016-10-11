import moment from 'moment';
import _ from 'underscore';

function sessionsService($http, userService, mentorService, $q, studentService) {
    var sessionState = {};

    function makeSessionsByGroup(sessions, sessionState) {
        sessions = sessions.filter(function(session) {
            return session.status !== 'pending' && session.status !== 'expired' || moment(session.createdAt).isAfter(twoDaysAgo);
        });
        var sessionsByMonth = _.groupBy(sessions, function(session) {
            return moment(session.startTime).startOf('month').format('MMMM YYYY');
        });
        var orderedSessions = [];
        return {
            sessionsByMonth: sessionsByMonth,
            sessionCount: sessionState.sessionCount
        }
    }

    function makeSessions(sessions, sessionState) {
        var twoDaysAgo = moment().add(-2,'days').startOf('day');
        sessions = sessions.filter(function(session) {
            return session.status !== 'expired' && moment(session.createdAt).isAfter(twoDaysAgo);
        });
        return sessions;
    }
    return {
        makeSessionsByGroup: makeSessionsByGroup,
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
                if (!session) {
                    throw new Error("test");
                }
                var mentorId = session.user_id;
                var studentId = session.student_id;
                return $q.all([mentorService.getMentor(mentorId), studentService.getStudent(studentId)])
                    .then(function(results) {
                        session.mentor = results[0];
                        session.student = results[1];
                        session.SessionTimeOption = session.SessionTimeOption.map(function(time) {
                            if(time)
                            {
                                return moment(time);
                            }
                        });
                        return session;
                    });
            });

        },
        confirmTime: function(session, day, startTime, endTime) {
            return $http.post('/sessions/' + session.id + '/update', {
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
            return $http.post('/sessions/' + session.id + '/destroy').then(function(res) {
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
        getSessionMentor: function() {
            return sessionState.mentor;
        },
        confirmSession: function(session, mentor, student) {
            return $http.post('/student/verify', {
                data: student
            }).then(function(res) {
                var studentData = res.data;
                if (studentData) {
                    session.student_id = studentData.id;
                    session.status = 'pending';
                    return $http.post('/mentor/' + mentor.user_id + '/sessions/appointment',
                        session).then(function(session) {
                        return true;
                    })
                } else {
                    return false;
                }
            })
        },
        getMentorsAndSessions: function() {
            return $http.get('/mentors/sessions').then(function(res) {
                console.log(res.data);
                return res.data;
            });
        },
        getSegmentsBetween: function(startTime, endTime) {
            var timesBetween = [];
            var currentTime = moment(startTime);
            var endTime = moment(endTime);
            while(currentTime.isBefore(endTime)) {
                timesBetween.push(currentTime);
                currentTime = currentTime.clone().add(30, 'minutes');
            }
            return timesBetween;
        },
        deduceTimeframes: function(mentor) {
            var times = [];
            var self = this;
            if(mentor.preferredTimeFrame) {
                mentor.preferredTimeFrame.forEach(function(timeframe) {
                    var startTimeTemplate = moment(timeframe.selectedStartTime.time);
                    var endTimeTemplate = moment(timeframe.selectedEndTime.time)
                    var weeksDifference = startTimeTemplate.diff(moment(), 'weeks');
                    var startTime = startTimeTemplate.add(weeksDifference,'weeks').day(timeframe.day);
                    var endTime = endTimeTemplate.add(weeksDifference,'weeks').day(timeframe.day);              
                   times = times.concat(self.getSegmentsBetween(startTime, endTime)); 
                });
            }
            return times;
        },
        makeTimes: function() {
            var times = [];
            for(var i=14; i<=46; i++) {
              var time = moment().startOf('day').add(i*30, 'minutes');
              times.push({time: time.toDate(), formattedTime: time.format("h:mm a")});
            }
            return times;
          },
        getMentorSessionsByMonth: function(mentorId) {
            var self = this;
            return $http.get('/mentor/' + mentorId + '/sessions').then(function(res) {
                var sessions = res.data;
                return mentorService.getMentorSettings(mentorId).then(function(sessionState) {
                    return makeSessionsByGroup(sessions, sessionState);
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
        },
        makePreferredTime: function(days) {
            let preferredDays = [];
            _.each(days, function(day) {
              if(_.isObject(day.selectedStartTime) && _.isObject(day.selectedEndTime)) {
                preferredDays.push(_.omit(day, 'startTimes', 'endTimes'));
              }
            });
            return preferredDays;
        },
        deduceDaySelectors: function(days, userSessionSettings) {
        (userSessionSettings.preferredTimeFrame || []).forEach(function(timeframe) {
            var matchingDay = _.find(days, function(setTimeframe) {
                return setTimeframe.day == timeframe.day;
            });
            if(matchingDay) {
            var matchingStartTime = _.find(matchingDay.startTimes, function(time) {
                return time.formattedTime === timeframe.selectedStartTime.formattedTime;
            });
            var matchingEndTime = _.find(matchingDay.endTimes, function(time) {
                return time.formattedTime === timeframe.selectedEndTime.formattedTime;
            });
            matchingDay.selectedStartTime = matchingStartTime;
            matchingDay.selectedEndTime = matchingEndTime;
        }
        });
        if(!userSessionSettings.preferredTimeFrame || userSessionSettings.preferredTimeFrame.length === 0) {
          days.forEach(function(day){
            var matchingStartTime = _.find(day.startTimes, function(time) {
              return time.formattedTime ===  "8:00 am";
            });
            var matchingEndTime = _.find(day.endTimes, function(time) {
              return time.formattedTime ===  "5:00 pm";
            });
            day.selectedStartTime = matchingStartTime;
            day.selectedEndTime = matchingEndTime;
          })
        }
        return days;
        },
        getDefaultTopics: function() {
            return ["Work/Life/School Balance", "Clubs", "Career Paths & Entrepreneurship", "Commuting", "Preparing to start FEMBA", "Classes"]
        },
        getDayOptions: function() {
            var times = this.makeTimes();
            return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(function(day) {
                return {
                    day: day,
                      startTimes: times,
                      endTimes: times,
                      selectedStartTime: null,
                      selectedEndTime: null 
                }
            });
          
        }
    };
}

sessionsService.$inject = ['$http', 'userService', 'mentorService', '$q', 'studentService'];
export default sessionsService;