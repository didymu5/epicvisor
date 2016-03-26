var moment = require('moment');
var Sessions = require('../../models/sessions');
var Student = require('../../models/student');


exports.bookAppointment = function (request, reply) {
  var bookingDetails = request.payload.data;
  bookingDetails.user_id = request.params.id;
  console.log("WHATSA UP?");
  console.log(bookingDetails);
  Sessions.create(bookingDetails).then(function(created) {
    reply(created);
  });
}

exports.checkStudentSignature = function(request, reply) {
  var studentDetails = request.payload.data;
  Student.findOne({where: {name: studentDetails.name, email: studentDetails.email}}).then(function(student) {
    if(student) {
      reply(student);
    }
    else {
      reply(undefined);
    }
  })
}
exports.getSessions = function(request, reply) {
  var dates = [moment().startOf('day').toDate(), moment().startOf('day').add('4','weeks').toDate()];
  Sessions.find({
    where:{'user_id': request.params.id,'date': {$between: dates 
      }}})
  .then(function(sessions) {
    reply(sessions || []);
  });
}

exports.getMentorSessions = function(request, reply) {
  var dates = [moment().startOf('day').toDate(), moment().startOf('day').add('4','weeks').toDate()];
  Sessions.findAll({
    where:{'date': {$between: dates 
      }}})
  .then(function(sessions) {
    reply(sessions || []);
  });
}