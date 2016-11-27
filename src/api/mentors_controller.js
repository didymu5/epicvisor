var sequelize = require('../../models').sequelize;
var UserProfileSessionSetting = require('../../models/user_profile_session_settings');

exports.getMentors = function (request, reply){
  sequelize.query(`SELECT users.id AS uid,* FROM users
    LEFT JOIN user_profiles ON users.id = user_profiles.user_id 
    LEFT JOIN user_profile_session_settings ON users.id = user_profile_session_settings.user_id
    WHERE users.inactive IS NOT TRUE
    `, { type: sequelize.QueryTypes.SELECT})
  .then(function(users) {
    reply(users);
  });
}

exports.getMentor = function (request, reply) {
  sequelize.query(`SELECT users.id AS id, * FROM users
    LEFT JOIN user_profiles ON users.id = user_profiles.user_id 
    LEFT JOIN user_profile_session_settings ON users.id = user_profile_session_settings.user_id
    WHERE users.id = ?`, { type: sequelize.QueryTypes.SELECT, replacements: [encodeURIComponent(request.params.id)]})
  .then(function(users) {
    reply(users[0]);
  });
}


exports.getMentorProfileSessionSettings = function (request, reply) {
  UserProfileSessionSetting.find({
    where: {
      user_id : encodeURIComponent(request.params.id)
    }
  }).then(function(userProfile) {
    reply(userProfile);
  });
}
