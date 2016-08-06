
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn('user_profiles', 'current_status', {
      type: Sequelize.STRING,
      defaultValue: 'FEMBAassador'
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('user_profiles', 'current_status');
  }
};
