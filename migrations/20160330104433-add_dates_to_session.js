'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('sessions','day', {
      type: Sequelize.DATE
    });
    queryInterface.addColumn('sessions','startTime', {
      type: Sequelize.DATE
    });
    queryInterface.addColumn('sessions','endTime', {
      type: Sequelize.DATE
    });

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
