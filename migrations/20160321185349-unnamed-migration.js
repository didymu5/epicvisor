'use strict';
var migrateHelper = require('../models/migrate_helper');
var column = migrateHelper.column;
module.exports = {
   up: function (queryInterface, Sequelize) {
    queryInterface.createTable("user_profiles", 
      migrateHelper.build_table(Sequelize,
        column("blurb", Sequelize.TEXT),
        column("year", Sequelize.STRING),
        column("user_id", Sequelize.STRING)

        )
      
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable("user_profiles");
  }
};
