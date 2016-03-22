var db = require('./index');
var Sequelize = db.Sequelize;
var UserProfile = db.sequelize.define('user_profiles',{
  id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      year: {
        type: Sequelize.STRING
      },
      blurb: {
        type: Sequelize.TEXT
      },
      user_id: {
        type: Sequelize.STRING
      }
})
module.exports = UserProfile;