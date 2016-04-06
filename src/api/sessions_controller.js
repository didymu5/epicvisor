var moment = require('moment');
var Sessions = require('../../models/sessions');
var Student = require('../../models/student');
var User = require('../../models/user');
var fs = require('fs');
var Path = require('path');
var Handlebars = require('handlebars');
var Mailgun = require('mailgun-js');
var iCalendar = require('icsjs');

function buildCalendar(startTime, endTime, summary) {
  // Let's do a party right now.
  var party = new iCalendar.EventBuilder();

  party.setStartDate(startTime);
  party.setEndDate(endTime);

  party.setSummary(summary);
  // Put that together in our calendar.
  var calendar = new iCalendar.CalendarBuilder();
  calendar.addEvent(party.getEvent());

  // And display it.
  return calendar.getCalendar().toString();
}

function sendConfirmationEmail(session, student, mentor) {
  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

  var emailTemplate =  Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/session-confirm.hbs'), 'utf-8'));
  var email_data = {
      from: 'no-reply@epicvisor.com',
      to: [mentor.email_address, student.email]
    }
  var startTime = moment(session.startTime).format('MMMM Do YYYY h:mm a');
  var endTime = moment(session.endTime).format('MMMM Do YYYY h:mm a');
  email_data.subject = "Session for " + startTime;
  var summary ="Epicvisor Session For " + mentor.first_name + " " + mentor.last_name + " and " + student.name;
  
  var buffer = new Buffer(buildCalendar(session.startTime, session.endTime, summary));
  var attachment = new mailgun.Attachment({
                          data: buffer,
                          filename:'calendar.ics',
                          contentType: 'ics'
  });
  email_data.attachment = attachment;
  email_data.html = emailTemplate({mentor: mentor, mentee:student,
   session: session, url: process.env.CALLBACK_URL, startTime: startTime, endTime: endTime})
  mailgun.messages().send(email_data, function(err, body){
    if(err){
      console.log(err);
    }
  });
}

function bookAndSendEmail(request, reply, student, mentor) {
  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

  var emailTemplate =  Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/email-intro.hbs'), 'utf-8'));
  var email_data = {
      from: 'no-reply@epicvisor.com',
      to: [mentor.email_address, student.email],
      
      
    }
    var bookingDetails = request.payload;
      bookingDetails.user_id = request.params.id;
      Sessions.create(bookingDetails).then(function(created) {
        week = moment(request.payload.date).startOf('week').format('MMMM Do YYYY');
        email_data.subject = "Session of " + week;
        email_data.html = emailTemplate({mentor: mentor, mentee:student,
         session: created, url: process.env.CALLBACK_URL, week: week})
        mailgun.messages().send(email_data, function(err, body){
          if(err){
            console.log(err);
            reply('email not sent');
          }
        reply('email sent');
        return created;
      });
    });
}

exports.bookAppointment = function (request, reply) {
  
  if(process.env['MAILGUN_DISABLED']) {
    var bookingDetails = request.payload;
      bookingDetails.user_id = request.params.id;
      Sessions.create(bookingDetails).then(function(created) {
            reply('emails sent');
    });
  }
  else {
    return Student.findOne({where: {id: request.payload.student_id}}).then(function(student) {
      return User.findOne({where: {id: request.params.id}}).then(function(user) {
        bookAndSendEmail(request, reply, student, user);  
      });
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
    console.log("the truth");
    console.log(updateMetadata);
    var session = updateMetadata[1][0];
    return Student.findOne({where: { id: session.student_id}}).then(function(student) {
      return User.findOne({where:{id: session.user_id }}).then(function(user) {
        sendConfirmationEmail(session, student, user);
        reply(session);
        return true;
      });
    });
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