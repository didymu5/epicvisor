'use strict';
var migrateHelper = require('../models/migrate_helper');
var column = migrateHelper.column;
module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable("students", 
      migrateHelper.build_table(Sequelize,
        column("user_id", Sequelize.INTEGER),
        column("class_year", Sequelize.INTEGER),
        column("name", Sequelize.STRING),
        column("email", Sequelize.STRING)

        )
      
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable("students");
  }
};
