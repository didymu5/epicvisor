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
    path: '/oauth/linkedin/login',
    handler: linkedInController.linkedInSignIn
  });
  server.route({
    method: 'GET',
    path: '/oauth/linkedin/callback/login',
    handler: linkedInController.linkedInSignBackIn
  });
  server.route({
    method: 'GET',
    path: '/logout',
    handler: linkedInController.logout
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
   server.route({
    method: 'GET',
    path: '/students/{id}',
    handler: sessionsController.getStudent
  })
   server.route({
    method: 'GET',
    path: '/students',
    handler: sessionsController.getStudents
  })
   server.route({
    method: 'POST',
    path: '/students/create',
    handler: sessionsController.createStudent
  })
   server.route({
    method: 'GET',
    path: '/sessions/{id}',
    handler: sessionsController.getSession
  })

    server.route({
    method: 'POST',
    path: '/sessions/{id}/destroy',
    handler: sessionsController.cancelAppointment
  });

     server.route({
    method: 'POST',
    path: '/sessions/{id}/update',
    handler: sessionsController.confirmAppointment
  });

     server.route({
      method: 'GET',
      path: '/mentors/sessions',
      handler: sessionsController.getAllMentorSessions
     })


  return next();
}

register.attributes = {
  name: 'api'
};

module.exports = register;
