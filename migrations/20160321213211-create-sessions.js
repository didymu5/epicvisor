'use strict';

var migrateHelper = require('../models/migrate_helper');
var column = migrateHelper.column;
module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable("sessions", 
      migrateHelper.build_table(Sequelize,
        column("date", Sequelize.DATE)  ,
        column("user_id", Sequelize.STRING),
        column("status", Sequelize.STRING)
        )
      
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable("sessions")
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
