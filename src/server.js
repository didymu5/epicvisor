'use strict';
var dotenv = require('dotenv').config();
var Hapi = require('hapi');
var good = require('good');
var api = require('./api');
const Path = require('path');
const Vision = require('vision');

require('babel-core/register')({
    presets: ['react', 'es2015']
});

var server = new Hapi.Server();
var options = {
    storeBlank: false,
    cookieOptions: {
        password: 'the-password-must-be-at-least-32-characters-long',
        isSecure: false
    }
};
server.connection({
  port: process.env.PORT || 3333,
  host: process.env.HOST
});
server.register({
    register: require('yar'),
    options: options
}, function (err) { });

server.register(require('inert'), (err) => {
  if (err) throw err;

  server.route({
     method: 'GET',
     path: '/{param*}',
     handler: {
       directory: {
         path: 'public',
         listing: true
       }
     }
   });
    server.route({
      method: 'GET',
      path: '/node_modules/{param*}',
      handler: {
          directory: {
              path: 'node_modules',
              redirectToSlash: false,
              index: false
          }
      }
  });


  server.route({
      method: 'GET',
      path: '/templates/{param*}',
      handler: {
          directory: {
              path: 'templates',
              redirectToSlash: false,
              index: false
          }
      }
  });
});

server.register([{
  register: good,
  options: {
    reporters: [{
      reporter: 'good-console',
      events: {log: '*', response: '*', error: '*'}
    }]
  }
}, {
  register: api
}], function(err) {
  'use strict';
  if (err) {
    console.error(err);
  } else {
    server.start(function() {
      console.log('Server started at: ' + server.info.uri); // jshint ignore:line
    });
  }
});








