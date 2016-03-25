var db = require('./index');
var Sequelize = db.Sequelize;
var Student = db.sequelize.define('students',{
  id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.STRING
      },
      class_year: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      }

})
module.exports = Student;