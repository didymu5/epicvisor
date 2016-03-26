var User = require('../../models/user');
var UserProfile = require('../../models/user_profile');
var UserProfileSessionSettings = require('../../models/user_profile_session_settings');
function prepare() {
	return User.sync({force: true}).then(function() {
	  return UserProfile.sync({force: true});
	}).then(function() {
	  return UserProfileSessionSettings.sync({force: true});
	});
}


exports.prepare = prepare;
    