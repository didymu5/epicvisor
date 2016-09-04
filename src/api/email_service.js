var Q = require('q');
var fs = require('fs');
var Path = require('path');
var Handlebars = require('handlebars');
var Mailgun = require('mailgun-js');
var iCalendar = require('icsjs');
var Sessions = require('../../models/sessions');
var moment = require('moment');
var shortid = require('shortid');
var moment = require('moment-timezone');
var UserProfile = require('../../models/user_profile');

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

exports.sendConfirmationEmail = function(session, student, mentor) {
  var mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  var emailTemplate = Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/session-confirm.hbs'), 'utf-8'));
  var email_data = {
    from: 'no-reply@epicvisor.com',
    to: [extractEmail(mentor, mentor.mentor_profile), student.email]
  }
  var startTime = moment(session.startTime).tz('America/Los_Angeles').format('MMMM Do YYYY h:mm a');
  var endTime = moment(session.endTime).tz('America/Los_Angeles').format('MMMM Do YYYY h:mm a');
  email_data.subject = "EpicSession Confirmed for " + startTime + " PT";
  var summary = "Epicvisor Session For " + mentor.first_name + " " + mentor.last_name + " and " + student.name;

  var buffer = new Buffer(buildCalendar(session.startTime, session.endTime, summary));
  var attachment = new mailgun.Attachment({
    data: buffer,
    filename: 'calendar.ics',
    contentType: 'ics'
  });
  email_data.attachment = attachment;

  email_data.html = emailTemplate({
    mentor: mentor,
    student: student,
    session: session,
    url: process.env.CALLBACK_URL,
    startTime: startTime,
    endTime: endTime
  })
  mailgun.messages().send(email_data, function(err, body) {
    if (err) {
      console.log(err);
    }
  });
}

exports.sendCancellationEmail = function(session, student, mentor, mentorProfile) {
  var mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  var emailTemplate = Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/session-cancel.hbs'), 'utf-8'));
  var email_data = {
    from: 'no-reply@epicvisor.com',
    to: [extractEmail(mentor, mentor.mentor_profile), student.email]
  }
  var beginTime = moment(session.date).tz('America/Los_Angeles').format('MMMM Do YYYY h:mm a');
  var startTime = startTime && moment(session.startTime).tz('America/Los_Angeles').format('MMMM Do YYYY @ h:mm a');
  var endTime = endTime && moment(session.endTime).tz('America/Los_Angeles').format('MMMM Do YYYY @ h:mm a');
  email_data.subject = "EpicSession Cancelled for " + (startTime || beginTime) + " PT";
  var summary = "Epicvisor Session Cancelled: " + mentor.first_name + " " + mentor.last_name + " and " + student.name;
  email_data.html = emailTemplate({
    mentor: mentor,
    student: student,
    session: session,
    url: process.env.CALLBACK_URL,
    startTime: startTime,
    endTime: endTime,
    beginTime: beginTime
  })
  mailgun.messages().send(email_data, function(err, body) {
    if (err) {
      console.log(err);
    }
  });
}

function extractEmail(mentor, userProfile) 
{
    var mentorEmail = userProfile.preferred_email || mentor.email_address ;
    return mentorEmail;
}

exports.bookAndSendEmail = function(request, reply, student, mentor, userProfileSettings, userProfile) {
  var mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }); 

  var emailTemplate = Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/session-request-email.hbs'), 'utf-8'));
  var email_data = {
    from: 'no-reply@epicvisor.com',
    to: [extractEmail(mentor, userProfile), student.email],
    cc: 'no-reply@epicvisor.com'
  }
  var bookingDetails = request.payload;
  bookingDetails.user_id = request.params.id;
  bookingDetails.encoded_url = shortid.generate();
  var timeOptions = bookingDetails.SessionTimeOption.map(function(time) {
    return moment(time).format("ddd h:mm a");
  });
  Sessions.create(bookingDetails).then(function(created) {
    week = moment(request.payload.date).tz('America/Los_Angeles').startOf('week').format('MMMM Do YYYY');
    email_data.subject = "EpicSession request for week of " + week + " "+bookingDetails.encoded_url;
    email_data.html = emailTemplate({
      mentor: mentor,
      userProfileSettings: userProfileSettings,
      student: student,
      session: created,
      url: process.env.CALLBACK_URL,
      week: week,
      time_options: timeOptions
    });
    mailgun.messages().send(email_data, function(err, body) {
      if (err) {
        console.log(err);
        reply('email not sent');
      } else {
        reply('email sent');
      }
      return created;
    });
  });
}