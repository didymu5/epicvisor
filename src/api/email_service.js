var Q = require('q');
var fs = require('fs');
var Path = require('path');
var Handlebars = require('handlebars');
var Mailgun = require('mailgun-js');
var iCalendar = require('icsjs');
var Sessions = require('../../models/sessions');
var moment = require('moment');
var shortid = require('shortid');


function buildCalendar (startTime, endTime, summary) {
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

exports.sendConfirmationEmail = function(session, student, mentor) {
  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

  var emailTemplate =  Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/session-confirm.hbs'), 'utf-8'));
  var email_data = {
      from: 'no-reply@epicvisor.com',
      to: [mentor.email_address, student.email]
    }
  var startTime = moment(session.startTime).format('MMMM Do YYYY h:mm a');
  var endTime = moment(session.endTime).format('MMMM Do YYYY h:mm a');
  email_data.subject = "EpicSession Confirmed for " + startTime;
  var summary ="Epicvisor Session For " + mentor.first_name + " " + mentor.last_name + " and " + student.name;
  
  var buffer = new Buffer(buildCalendar(session.startTime, session.endTime, summary));
  var attachment = new mailgun.Attachment({
                          data: buffer,
                          filename:'calendar.ics',
                          contentType: 'ics'
  });
  email_data.attachment = attachment;
  email_data.html = emailTemplate({mentor: mentor, student:student,
   session: session, url: process.env.CALLBACK_URL, startTime: startTime, endTime: endTime})
  mailgun.messages().send(email_data, function(err, body){
    if(err){
      console.log(err);
    }
  });
}

exports.sendCancellationEmail = function(session, student, mentor) {
  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

  var emailTemplate =  Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/session-cancel.hbs'), 'utf-8'));
  var email_data = {
      from: 'no-reply@epicvisor.com',
      to: [mentor.email_address, student.email]
    }
  var beginTime = moment(session.date).format('MMMM Do YYYY h:mm a');
  var startTime = startTime && moment(session.startTime).format('MMMM Do YYYY h:mm a');
  var endTime = endTime && moment(session.endTime).format('MMMM Do YYYY h:mm a');
  email_data.subject = "Session for " + (startTime || beginTime) + " cancelled";
  var summary = "Epicvisor Session Cancelled: " + mentor.first_name + " " + mentor.last_name + " and " + student.name;
  email_data.html = emailTemplate({mentor: mentor, student:student,
   session: session, url: process.env.CALLBACK_URL, startTime: startTime, endTime: endTime, beginTime: beginTime})
  mailgun.messages().send(email_data, function(err, body){
    if(err){
      console.log(err);
    }
  });
}

exports.bookAndSendEmail = function(request, reply, student, mentor) {
  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

  var emailTemplate =  Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/email-intro.hbs'), 'utf-8'));
  var email_data = {
      from: 'no-reply@epicvisor.com',
      to: [mentor.email_address, student.email]
    }
    var bookingDetails = request.payload;
      bookingDetails.user_id = request.params.id;
      bookingDetails.encoded_url = shortid.generate();
      Sessions.create(bookingDetails).then(function(created) {
        week = moment(request.payload.date).startOf('week').format('MMMM Do YYYY');
        email_data.subject = "EpicSession request for week of " + week;
        email_data.html = emailTemplate({mentor: mentor, student:student,
         session: created, url: process.env.CALLBACK_URL, week: week})
        mailgun.messages().send(email_data, function(err, body){
          if(err){
            console.log('email error');
            console.log(err);
            reply('email not sent');
          }
          else {
            reply('email sent'); 
          }
        return created;
      });
    });
}
