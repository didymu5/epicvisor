var User = require('../../models/user');
var UserProfile = require('../../models/user_profile');
var UserProfileSessionSetting = require('../../models/user_profile_session_settings');

exports.getUserProfile = function(request, reply) {
 UserProfile.findOne({
    where: {
      user_id : request.yar.get('user').id.toString()
    }
  }).then(function(userProfile) {
    reply(userProfile || {});
  });
}
exports.setUserProfile = function (request, reply) {
UserProfile.findOrCreate({
    where: {
      user_id : request.yar.get('user').id.toString()
    }
  }).then(function(userSettingSet) {
    var userSetting = userSettingSet[0];
    return userSetting.update(request.payload.profileSettings, {fields:  ["year","blurb"]});
  }).then(function(userData) {
    reply(userData);
  });
}

exports.getUserProfileSessionSettings = function(request, reply) {
  UserProfileSessionSetting.find({
    where: {
      user_id : request.yar.get('user').id.toString()
    }
  }).then(function(userProfile) {
    reply(userProfile);
  });
}



exports.getUserInfo = function(request, reply) {
  var user = request.yar.get('user');
  reply(user);  
}

exports.setUserProfileSessionSettings = function(request, reply) {
  UserProfileSessionSetting.findOrCreate({
    where: {
      user_id : request.yar.get('user').id.toString()
    }
  }).then(function(userSettingSet) {
    var userSetting = userSettingSet[0];
    ["topics", "contact","sessionCount", "sessionCountType",
     "extraTopic1", "extraTopic2", "extraTopic3", "contactDetails", "user_id"].forEach(function(attr) {
      userSetting[attr] = request.payload[attr];
     });
    return userSetting.update(request.payload.sessionState, {fields:  ["topics", "contact","sessionCount", "sessionCountType",
     "extraTopic1", "extraTopic2", "extraTopic3", "contactDetails", "user_id"]});
  }).then(function(userData) {
    reply(userData);
  });
}