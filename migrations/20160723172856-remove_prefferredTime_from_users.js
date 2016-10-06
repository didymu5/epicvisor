'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'preferredTimeFrame');
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'preferredTimeFrame');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};