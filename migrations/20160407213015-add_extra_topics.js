'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.addColumn('sessions', 'topics', 
    {
      type: Sequelize.ARRAY(Sequelize.STRING)
    });
  },

  down: function (queryInterface, Sequelize) {
        queryInterface.removeColumn('sessions', 'topics');
  }
};
