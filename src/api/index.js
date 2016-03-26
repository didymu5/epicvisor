  'use strict';
var sessionsController = require('./sessions_controller');
var mentorsController = require('./mentors_controller');
var linkedInController = require('./linked_in_controller').initialize(require('node-linkedin'));
var usersController = require('./users_controller');

function register(server, options, next) {
  'use strict';

  server.route({
    method: 'GET',
    path: '/oauth/linkedin/callback',
    handler: linkedInController.linkedInOAUTH
  });
  server.route({
    method: 'GET',
    path: '/oauth/linkedin',
    handler: linkedInController.requestAuth
  });

  server.route({
    method: 'GET',
    path: '/user/info',
    handler: usersController.getUserInfo
  });
   server.route({
    method: 'GET',
    path: '/user/mentor/settings/session',
    handler: usersController.getUserProfileSessionSettings
   });
   server.route({
    method: 'POST',
    path: '/user/mentor/settings/session/create',
    handler: usersController.setUserProfileSessionSettings
   });
    server.route({
    method: 'GET',
    path: '/user/mentor/profile',
    handler: usersController.getUserProfile
   });
     server.route({
    method: 'POST',
    path: '/user/mentor/profile/create',
    handler: usersController.setUserProfile
   });
  server.route({
    method: 'GET',
    path: '/sessions/user',
    handler: sessionsController.getSessions
  });
  server.route({
    method: 'GET',
    path: '/mentors',
    handler: mentorsController.getMentors
  });
  server.route({
    method:'GET',
    path: '/mentors/{id}',
    handler: mentorsController.getMentor
  });

  server.route({
    method: 'GET',
    path:'/mentor/{id}/sessions',
    handler: sessionsController.getMentorSessions
  })

  server.route({
    method:'GET',
    path:'/mentor/{id}/settings/session',
    handler: mentorsController.getMentorProfileSessionSettings
  })

  server.route({
    method: 'POST',
    path: '/mentor/{id}/sessions/appointment',
    handler: sessionsController.bookAppointment
  });
  server.route({
    method: 'POST',
    path: '/student/verify',
    handler: sessionsController.checkStudentSignature
  })

  return next();
}

register.attributes = {
  name: 'api'
};

module.exports = register;
