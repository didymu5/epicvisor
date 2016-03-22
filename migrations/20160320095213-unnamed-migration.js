'use strict';
var migrateHelper = require('../models/migrate_helper');
var column = migrateHelper.column;
module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable("user_profile_session_settings", 
      migrateHelper.build_table(Sequelize,
        column("topics", Sequelize.ARRAY(Sequelize.STRING) ),
        column("contact", Sequelize.STRING),
        column("sessionCount", Sequelize.INTEGER),
        column("sessionCountType", Sequelize.STRING),
        column("extraTopic1", Sequelize.STRING),
        column("extraTopic2", Sequelize.STRING),
        column("extraTopic3", Sequelize.STRING),
        column("contactDetails", Sequelize.STRING),
        column("user_id", Sequelize.STRING)

        )
      
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable("user_profile_session_settings");
  }
};
