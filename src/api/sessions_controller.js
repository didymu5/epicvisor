var moment = require('moment');
var Sessions = require('../../models/sessions');
var Student = require('../../models/student');
var fs = require('fs');
var Path = require('path');
var Handlebars = require('Handlebars');

exports.bookAppointment = function (request, reply) {
  var bookingDetails = request;
  var Mailgun = require('mailgun-js');

  // bookingDetails.user_id = encodeURIComponent(request.params.id);
  console.log("WHATSA UP?");
  var emailTemplate =  Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/email-intro.hbs'), 'utf-8'));

  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
  var email_data = {
    from: 'no-reply@epicvisor.com',
    to: 'wu.thomas@gmail.com, ian.norris.1991@gmail.com',
    subject:'',
    html: emailTemplate({mentor: 'Eugene Kim', mentee:'Tommy'})
  }
  mailgun.messages().send(email_data, function(err, body){
    if(err){
      throw err;
    }
    reply('emails sent');
  });
  // Sessions.create(bookingDetails).then(function(created) {
  //   console.log(created)
    // email_data.to = created.menotorEmail + ',' + created.menteeEmail;
    // email_data.subject = created.menotee + 'would like to book time with you';
    // email_data.html = emailTemplate({mentor: created.mentor, mentee: createdmentee});

    // mailgun.messages().send(email_data, function(err, body){
    // if(err){
    //   throw err;
    // }
    //   reply('emails sent');
    // });
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