'use strict';
var dotenv = require('dotenv').config();
var Hapi = require('hapi');
var good = require('good');
var api = require('./api');
const Path = require('path');

const Vision = require('vision');
const HapiReactViews = require('hapi-react-views');

require('babel-core/register')({
    presets: ['react', 'es2015']
});

var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

server.route({
    method: 'GET',
    path: 'bower_components/{param*}',
    handler: {
        directory: {
            path: 'bower_components',
            redirectToSlash: true,
            index: false
        }
    }
});

server.route({
    method: 'GET',
    path: 'public/{param*}',
    handler: {
        directory: {
            path: 'public',
            redirectToSlash: true,
            index: false
        }
    }
});

server.route({
    method: 'GET',
    path: 'templates/{param*}',
    handler: {
        directory: {
            path: 'templates',
            redirectToSlash: true,
            index: false
        }
    }
});

server.connection({
  port: process.env.PORT || 3000,
  host: process.env.HOST
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


server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('public/index.html');
        }
    });

    server.start((err) => {

        if (err) {
            throw err;
        }

    });
});
