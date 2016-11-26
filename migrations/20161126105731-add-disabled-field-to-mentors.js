'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
     queryInterface.addColumn('users', 'inactive', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'inactive');
  }
};
