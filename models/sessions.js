var db = require('./index');
var Sequelize = db.Sequelize;
var Session = db.sequelize.define('sessions', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.STRING
  },
  encoded_url: {
    type: Sequelize.STRING
  },
  date: {
    type: Sequelize.DATE
  },
  topics: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  status: {
    type: Sequelize.STRING
  },
  student_id: {
    type: Sequelize.INTEGER
  },
  day: {
    type: Sequelize.DATE
  },
  startTime: {
    type: Sequelize.DATE
  },
  endTime: {
    type: Sequelize.DATE
  },
  SessionTimeOption: {
    type: Sequelize.ARRAY(Sequelize.DATE)
  }
})
module.exports = Session;