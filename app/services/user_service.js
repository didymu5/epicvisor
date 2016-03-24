import moment from 'moment';

function userService($http, $q) {
  var userState = {};
  var userStateFetch = $http.get('/user/info').then(function(res) {
    userState.user = res.data;
    return userState.user;
  });
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
    getUser: function() {
      return userStateFetch;
    },
    getProfile: function() {
      return $http.get('/user/mentor/profile').then(function(res) {
        userState.profile = res.data;
        return userState.profile;
      });
    },
    getSessions: function() {
      var self = this;
      return $http.get('/sessions/user').then(function(res) {
        var sessions = res.data;
        return self.getSessionSettings().then(function(sessionState) {       
          return makeSessions(sessions, sessionState);
        })
      });
    },
    getSessionSettings: function() {
      return $http.get('/user/mentor/settings/session').then(function(res) {
        userState.sessionSettings = res.data;
        return userState.sessionSettings;
      });
    },
    setSessionSettings: function(sessionState) {
      return $http({
        method: 'POST',
        url: '/user/mentor/settings/session/create',
        data: {
          sessionState
        }
      });
    },
    setProfileSettings: function(profileSettings) {
      return $http({
        method: 'POST',
        url: '/user/mentor/profile/create',
        data: {
          profileSettings
        }
      });
    }
  };
}
userService.$inject = ['$http','$q'];
export default userService;