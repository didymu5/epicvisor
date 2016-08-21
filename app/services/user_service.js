import moment from 'moment';

function userService($http, $q) {
  var userState = {};
  var userStateFetch = $http.get('/user/info').then(function(res) {
    userState.user = res.data;
    return userState.user;
  });
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
    getSessionSettings: function() {
      return $http.get('/user/mentor/settings/session').then(function(res) {
        userState.sessionSettings = res.data;
        var times = userState.sessionSettings.preferredTimeFrame;
        if(times) {
          times.forEach(function(time) {
            time.selectedEndTime.time = moment(time.selectedEndTime.time).toDate();
            time.selectedStartTime.time = moment(time.selectedStartTime.time).toDate();
          });
        }
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