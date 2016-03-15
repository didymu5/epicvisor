'use strict';
var Hapi = require('hapi');
var good = require('good');
var api = require('./api');
const Path = require('path');
var dotenv = require('dotenv').config();


const Vision = require('vision');
const HapiReactViews = require('hapi-react-views');

require('babel-core/register')({
    presets: ['react', 'es2015']
});

var server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 3000,
  host: process.env.HOST
});
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
      path: '/bower_components/{param*}',
      handler: {
          directory: {
              path: 'bower_components',
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








