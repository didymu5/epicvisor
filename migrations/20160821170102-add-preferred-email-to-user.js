'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn('user_profiles', 'preferred_email', {
      type: Sequelize.STRING
    });
  },

  down: function (queryInterface, Sequelize) {
        queryInterface.removeColumn('user_profiles', 'preferred_email');
  }
};
