'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('user_profile_session_settings', 'career_topics', 
    {
      type: Sequelize.ARRAY(Sequelize.STRING)
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('user_profile_session_settings', 'career_topics');
  }
};
