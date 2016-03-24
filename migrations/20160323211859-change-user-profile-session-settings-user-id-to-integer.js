  'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
       queryInterface.removeColumn('user_profile_session_settings', 'user_id');
        queryInterface.addColumn('user_profile_session_settings', 'user_id', 
        {
          type: Sequelize.INTEGER
        });
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
