'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn('user_profile_session_settings', 'preferredTimeFrame', {
      type: Sequelize.ARRAY(Sequelize.JSON)
    });
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.removeColumn('user_profile_session_settings', 'preferredTimeFrame');
  }
};