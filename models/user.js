var db = require('./index');
var Sequelize = db.Sequelize;
var User = db.sequelize.define('user',{
  id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      summary: {
        type: Sequelize.TEXT
      },
      public_url: {
        type: Sequelize.STRING
      },
      email_address: {
        type: Sequelize.STRING
      },
       positions: {
        type: Sequelize.JSON
      },
      headline: {
        type: Sequelize.STRING
      },
      industry: {
        type: Sequelize.STRING
      },
       user_access_token: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
       specialties: {
        type: Sequelize.STRING
      },
      linkedin_id: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      }
})
module.exports = User;