var moment = require('moment');
var Sessions = require('../../models/sessions');
var Student = require('../../models/student');


exports.bookAppointment = function (request, reply) {
  var bookingDetails = request;
  console.log(bookingDetails);
  reply(bookingDetails).code(204);
  var Mailgun = require('mailgun-js');

  // bookingDetails.user_id = encodeURIComponent(request.params.id);
  console.log("WHATSA UP?");
  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
  var email_data = {
    from: 'no-reply@epicvisor.com',
    to: 'wu.thomas@gmail.com, ehkim007@gmail.com, ian.norris.1991@gmail.com',
    subject:'',
    html:'hello'
  }
  mailgun.messages().send(email_data, function(err, body){
    if(err){
      reply('sent email');
    }
  });
  // Sessions.create(bookingDetails).then(function(created) {
  //   console.log(created)
  //   reply(created);
  // });
}
exports.checkStudentSignature = function(request, reply) {
  var studentDetails = request.payload.data;
  Student.findOne({where: {name: studentDetails.name, email: studentDetails.email}}).then(function(student) {
    if(student) {
      reply(student);
    }
    else {
      reply(undefined).code(204);
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