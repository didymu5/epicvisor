var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection();
var db_setup = require('../setup/db_setup');


module.exports = function(done) {
  'use strict';
  	db_setup.prepare().then(function() {
  		server.start(() => done(server));
	});
}
