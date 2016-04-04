var db = require('./index');
var Sequelize = db.Sequelize;
var UserProfileSessionSettings = db.sequelize.define('user_profile_session_settings',{
  id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      topics: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      contact: {
        type: Sequelize.STRING
      },
      sessionCount: {
        type: Sequelize.INTEGER
      },
      sessionCountType: {
        type: Sequelize.STRING
      },
      extraTopic1: {
        type: Sequelize.STRING
      },
       extraTopic2: {
        type: Sequelize.STRING
      },
      extraTopic3: {
        type: Sequelize.STRING
      },
      career_topics: {
         type: Sequelize.ARRAY(Sequelize.STRING)
       },
      contactDetails: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      }
})
module.exports = UserProfileSessionSettings;