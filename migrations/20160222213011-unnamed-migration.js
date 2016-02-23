'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      headline: {
        type: Sequelize.STRING
      },
      summary: {
        type: Sequelize.TEXT
      },
      public_url: {
        type: Sequelize.STRING
      }
    });

  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable("users")
  }
};
