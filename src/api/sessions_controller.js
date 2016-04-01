var moment = require('moment');
var Sessions = require('../../models/sessions');
var Student = require('../../models/student');
var fs = require('fs');
var Path = require('path');
var Handlebars = require('Handlebars');

exports.bookAppointment = function (request, reply) {
  var Mailgun = require('mailgun-js');

  // bookingDetails.user_id = encodeURIComponent(request.params.id);
  var emailTemplate =  Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/email-intro.hbs'), 'utf-8'));

  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
  var email_data = {
    from: 'no-reply@epicvisor.com',
    to: 'wu.thomas@gmail.com, ian.norris.1991@gmail.com',
    subject:'',
    html: emailTemplate({mentor: 'Eugene Kim', mentee:'Tommy'})
  }
  if(process.env['MAILGUN_DISABLED']) {
    var bookingDetails = request.payload;
      bookingDetails.user_id = request.params.id;
      Sessions.create(bookingDetails).then(function(created) {
            reply('emails sent');
    });
  }
  else {
    var bookingDetails = request.payload;
      bookingDetails.user_id = request.params.id;
      Sessions.create(bookingDetails).then(function(created) {
        mailgun.messages().send(email_data, function(err, body){
          if(err){
            throw err;
          }
        reply('email sent');
        return created;
      });
    });
  }


  
 
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
exports.confirmAppointment = function(request, reply) {
  var bookingDetails = request.payload.data;
  var sessionId = request.params.id;
  console.log("LE ID! " + sessionId);
  console.log("LE PAYLOAD!");
  console.log(bookingDetails);
  Sessions.update({
   day: bookingDetails.day,
   startTime: bookingDetails.startTime,
   endTime: bookingDetails.endTime,
   status: 'confirmed'
  },
  {
    where: {
      id: sessionId
    }
  }).then(function(session) {
    reply(session);
  });
}

exports.cancelAppointment = function(request, reply) {
  var sessionId = request.params.id;
  Sessions.destroy({
    where: {
      id: sessionId
    }
  }).then(function(deleted) {
    reply();
  });
}

exports.getStudent = function(request, reply) {
  Student.findOne({where:{id: request.params.id}}).then(function(student) {
    reply(student || undefined);
  });
}

exports.getSession = function(request, reply) {
  Sessions.findOne({where:{id: request.params.id}}).then(function(session) {
    reply(session || undefined);
  });
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