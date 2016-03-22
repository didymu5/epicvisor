'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'positions');
    queryInterface.addColumn('users','positions',{
      type: Sequelize.JSON
    });
    queryInterface.removeColumn('user_profiles', 'user_id');
    queryInterface.addColumn('user_profiles', 'user_id', 
    {
      type: Sequelize.INTEGER
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    // queryInterface.changeColumn('users','positions',{
    //   type: Sequelize.STRING
    // });
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
