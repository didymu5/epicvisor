'use strict';
var dotenv = require('dotenv').config();

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
if (env === "development") {
  var config = require(__dirname + './../config/config.json')[env];
} else {
  var config = require(__dirname + './../config/prod_config.json')[env];
}

var db = {};

if (config.use_env_variable) {
  var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

    sequelize = new Sequelize(match[5], match[1], match[2], {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     match[4],
      host:     match[3],
      logging:  true //false
  })
} else {
  var username = process.env.USERNAME  || config.username;
  var sequelize = new Sequelize(config.database, username, config.password, config);
}



db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;




