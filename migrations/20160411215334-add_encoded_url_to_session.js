'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('sessions', 'encoded_url', 
      {
        type: Sequelize.STRING
      });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('sessions', 'encoded_url');
  }
};
