'use strict';

var columns = {};

function defaults(Sequelize) {
  columns.id = {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  };
  columns.createdAt = {
    type: Sequelize.DATE
  };
  columns.updatedAt = {
    type: Sequelize.DATE
  };
}

function build_table(Sequelize,listOfColumns) {
  defaults(Sequelize);
  return columns;
}

function column(name,type) {
  columns[name] = {
    type: type
  };
}

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable("users", 
      build_table(Sequelize,
        column("first_name", Sequelize.STRING),
        column("last_name", Sequelize.STRING),
        column("headline", Sequelize.STRING),
        column("summary", Sequelize.TEXT),
        column("public_url", Sequelize.STRING),
        column("email_address", Sequelize.STRING),
        column("positions", Sequelize.STRING),
        column("specialties", Sequelize.STRING),
        column("industry", Sequelize.STRING),
        column("location", Sequelize.STRING),
        column("user_access_token", Sequelize.STRING),
        column("linkedin_id", Sequelize.STRING)

        )
      
    );

  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable("users")
  }
};
