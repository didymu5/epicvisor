var db = require('./index');
var Sequelize = db.Sequelize;

var User = db.sequelize.define('user',{
  id: {
        type: Sequelize.INTEGER,
        primaryKey: true
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
      }
})
module.exports = User;