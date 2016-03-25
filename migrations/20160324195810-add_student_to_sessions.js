'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn("sessions","student_id", {
      type: Sequelize.INTEGER
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn("sessions", "student_id");
    
  }
};
