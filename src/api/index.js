  'use strict';
var Linkedin = require('node-linkedin')( '753q6tuln2wr0s', 'lK27ABwIJOYFe8Uz');//TODO put id/secret in config file
var callback_url = process.env.CALLBACK_URL || "https://arcane-badlands-87546.herokuapp.com";
Linkedin.auth.setCallback(callback_url + '/oauth/linkedin/callback');

var scope = ['r_basicprofile',  'r_emailaddress'];
var User = require('../../models/user');
var UserProfile = require('../../models/user_profile');
var UserProfileSessionSetting = require('../../models/user_profile_session_settings');
var Sessions = require('../../models/sessions');
var Student = require('../../models/student');
var moment = require('moment');
var sequelize = require('../../models').sequelize;

function bookAppointment(request, reply) {
  var bookingDetails = request.payload.data;
  bookingDetails.user_id = request.params.id;
  console.log("WHATSA UP?");
  console.log(bookingDetails);
  Sessions.create(bookingDetails).then(function(created) {
    reply(created);
  });
}

function checkStudentSignature(request, reply) {
  var studentDetails = request.payload.data;
  Student.findOne({where: {name: studentDetails.name, email: studentDetails.email}}).then(function(student) {
    if(student) {
      reply(student);
    }
    else {
      reply(undefined);
    }
  })
}

function getMentors(request, reply){
  sequelize.query("SELECT * FROM users LEFT JOIN user_profiles ON users.id = user_profiles.user_id", { type: sequelize.QueryTypes.SELECT})
  .then(function(users) {
    reply(users);
  });
}

function getMentor(request, reply) {
  sequelize.query(`SELECT * FROM users
    LEFT JOIN user_profiles ON users.id = user_profiles.user_id 
    LEFT JOIN user_profile_session_settings ON users.id = user_profile_session_settings.user_id
    WHERE users.id = ?`, { type: sequelize.QueryTypes.SELECT, replacements: [request.params.id]})
  .then(function(users) {
    reply(users[0]);
  });
}

function getSessions(request, reply) {
  var dates = [moment().startOf('day').toDate(), moment().startOf('day').add('4','weeks').toDate()];
  Sessions.find({
    where:{'user_id': request.params.id,'date': {$between: dates 
      }}})
  .then(function(sessions) {
    reply(sessions || []);
  });
}

function getMentorSessions(request, reply) {
  var dates = [moment().startOf('day').toDate(), moment().startOf('day').add('4','weeks').toDate()];
  Sessions.findAll({
    where:{'date': {$between: dates 
      }}})
  .then(function(sessions) {
    console.log("WUt WUT IN")
    console.log(sessions);
    reply(sessions || []);
  });
}

function getUserProfile(request, reply) {
 UserProfile.findOne({
    where: {
      user_id : request.yar.get('user').id.toString()
    }
  }).then(function(userProfile) {
    reply(userProfile || {});
  });
}
function setUserProfile(request, reply) {
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

function getUserProfileSessionSettings(request, reply) {
  UserProfileSessionSetting.find({
    where: {
      user_id : request.yar.get('user').id.toString()
    }
  }).then(function(userProfile) {
    reply(userProfile);
  });
}

function getMentorProfileSessionSettings(request, reply) {
  UserProfileSessionSetting.find({
    where: {
      user_id : request.params.id
    }
  }).then(function(userProfile) {
    reply(userProfile);
  });
}

function setUserProfileSessionSettings(request, reply) {
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

function getUserInfo(request, reply) {
  var user = request.yar.get('user');
  reply(user);  
}


function requestAuth(request, reply) {
   Linkedin.auth.authorize(reply, scope);
}

function linkedInOAUTH(request, reply) {
   Linkedin.auth.getAccessToken(reply, request.query.code, request.query.state, function(err, results) {
        if ( err )
            return console.error(err);
        var linkedin = Linkedin.init(results.access_token);
        linkedin.people.me(['id','first-name','last-name','picture-url', 'headline','location','industry','summary','positions','specialties','public-profile-url','email-address'], function(err, $in) {
          var userDetails = {
            first_name: $in.firstName,
            last_name: $in.lastName,
            email_address: $in.emailAddress,
            industry: $in.industry,
            public_url: $in.publicProfileUrl,
            summary: $in.summary,
            headline: $in.headline,
            user_access_token: results.access_token,
            avatar: $in.pictureUrl,
            linkedin_id: $in.id,
            positions: $in.positions
          }
          User.findOrCreate({
            where: {
              linkedin_id: $in.id
            },
            defaults: userDetails}).then(function(userData) {
            userData[0].update(userDetails, {fields: Object.keys(userDetails)}).then(function(userData) {
              request.yar.set('user', userData);
              return reply.redirect('/index.html#/profile');
            });
          });
        });
    });
}

function register(server, options, next) {
  'use strict';

  server.route({
    method: 'GET',
    path: '/oauth/linkedin/callback',
    handler: linkedInOAUTH
  });
  server.route({
    method: 'GET',
    path: '/oauth/linkedin',
    handler: requestAuth
  });

  server.route({
    method: 'GET',
    path: '/user/info',
    handler: getUserInfo
  });
   server.route({
    method: 'GET',
    path: '/user/mentor/settings/session',
    handler: getUserProfileSessionSettings
   });
   server.route({
    method: 'POST',
    path: '/user/mentor/settings/session/create',
    handler: setUserProfileSessionSettings
   });
    server.route({
    method: 'GET',
    path: '/user/mentor/profile',
    handler: getUserProfile
   });
     server.route({
    method: 'POST',
    path: '/user/mentor/profile/create',
    handler: setUserProfile
   });
  server.route({
    method: 'GET',
    path: '/sessions/user',
    handler: getSessions
  });
  server.route({
    method: 'GET',
    path: '/mentors',
    handler: getMentors
  });
  server.route({
    method:'GET',
    path: '/mentors/{id}',
    handler: getMentor
  });

  server.route({
    method: 'GET',
    path:'/mentor/{id}/sessions',
    handler: getMentorSessions
  })

  server.route({
    method:'GET',
    path:'/mentor/{id}/settings/session',
    handler: getMentorProfileSessionSettings
  })

  server.route({
    method: 'POST',
    path: '/mentor/{id}/sessions/appointment',
    handler: bookAppointment
  });
  server.route({
    method: 'POST',
    path: '/student/verify',
    handler: checkStudentSignature
  })

  return next();
}

register.attributes = {
  name: 'api'
};

module.exports = register;
