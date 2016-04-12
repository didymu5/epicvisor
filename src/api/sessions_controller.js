var moment = require('moment');
var Sessions = require('../../models/sessions');
var Student = require('../../models/student');
var User = require('../../models/user');
var Q = require('q');
var shortid = require('shortid');
var emailService = require('./email_service');
exports.bookAppointment = function (request, reply) {
  
  if(process.env['MAILGUN_DISABLED']) {
    var bookingDetails = request.payload;
      bookingDetails.encoded_url = shortid.generate();
      bookingDetails.user_id = request.params.id;
      Sessions.create(bookingDetails).then(function(created) {
            reply('emails sent');
    });
  }
  else {
    var student = Student.findOne({where: {id: request.payload.student_id}})
    var user = User.findOne({where: {id: request.params.id}});
    return Q.all([student, user]).then(function(data) {
      console.log("ALLO!");
      console.log(data);
        emailService.bookAndSendEmail(request, reply, data[0], data[1]);  
    });
    
  }
}
exports.confirmAppointment = function(request, reply) {
  var bookingDetails = request.payload.data;
  var sessionId = request.params.id;

  Sessions.update({
   day: bookingDetails.day,
   startTime: bookingDetails.startTime,
   endTime: bookingDetails.endTime,
   status: 'confirmed'
  },
  {
    returning: true,
    where: {
      id: sessionId
    }
  }).then(function(updateMetadata) {
    return getSessionAndDetails(sessionId).then(function(sessionDetails){
      if(!process.env['MAILGUN_DISABLED']) {
          emailService.sendConfirmationEmail(sessionDetails.session, sessionDetails.student, sessionDetails.mentor);
        }
        reply(sessionDetails.session);
        return true;
    });
  });
}

exports.cancelAppointment = function(request, reply) {
  var sessionId = request.params.id;
  getSessionAndDetails(sessionId).then(function(sessionDetails){
     Sessions.destroy({
        where: {
          id: sessionId
        }
      }).then(function(deleted) {
        console.log(sessionDetails);
        emailService.sendCancellationEmail(sessionDetails.session, sessionDetails.student, sessionDetails.mentor);
        reply();
      });
    });
 
}

function getSessionAndDetails(session_id) {
  return Sessions.findOne({where: {id: session_id}}).then(function(session) {
    var student = Student.findOne({where:{id: session.student_id }});
    var mentor = User.findOne({where:{id: session.user_id }})
    return Q.all([student, mentor]).then(function(results) {
      return {
        student: results[0],
        mentor: results[1],
        session: session
      };
    });
  });
}

exports.getStudent = function(request, reply) {
  Student.findOne({where:{id: request.params.id}}).then(function(student) {
    reply(student || undefined);
  });
}

exports.getSession = function(request, reply) {
  Sessions.findOne({where:{encoded_url: request.params.id}}).then(function(session) {
    reply(session || undefined);
  });
}

exports.checkStudentSignature = function(request, reply) {
  var studentDetails = request.payload.data;
  Student.findOne({where: { email: studentDetails.email}}).then(function(student) {
    if(student) {
      reply(student);
    }
    else {
      reply(undefined).code(204);
    }
  })
}
exports.getSessions = function(request, reply) {
  var user = request.yar.get('user')
  var dates = [moment().startOf('day').startOf('week').toDate(), moment().startOf('day').endOf('week').add('4','weeks').toDate()];
  Sessions.findAll({
    where:{'user_id': user.id && user.id.toString(),'date': {$between: dates 
      }}})
  .then(function(sessions) {
    reply(sessions || []);
  });
}

exports.getMentorSessions = function(request, reply) {
  var dates = [moment().startOf('day').startOf('week').toDate(), moment().startOf('day').startOf('week').add('4','weeks').toDate()];
  Sessions.findAll({
    where:{'user_id': request.params.id,'date': {$between: dates 
      }}})
  .then(function(sessions) {
    reply(sessions || []);
  });
}