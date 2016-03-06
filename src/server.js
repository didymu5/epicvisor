'use strict';
var Hapi = require('hapi');
var good = require('good');
var api = require('./api');

const Vision = require('vision');
const HapiReactViews = require('hapi-react-views')

require('babel-core/register')({
    presets: ['react', 'es2015']
});

var server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 3000,
  host: '0.0.0.0'
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
server.register(Vision, (err) => {
   if (err) {
        console.log('Failed to load vision.');
    }

    server.views({
        engines: {
            jsx: HapiReactViews
        },
        relativeTo: __dirname,
        path: 'views'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            
            reply.view('home');
        }
    });

    server.route({
      method: 'GET',
      path: '/profile',
      handler: (request, reply) => {
        var user = require('.././models/user');
        user.findAll().then(function(users) { 
          reply.view('profile', {users: users});
        })
      }
    });

})