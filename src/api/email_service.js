var Q           = require('q'),
    fs          = require('fs'),
    Path        = require('path'),
    Handlebars  = require('handlebars'),
    Mailgun     = require('mailgun-js'),
    iCalendar   = require('icsjs'),
    Sessions    = require('../../models/sessions'),
    moment      = require('moment'),
    shortid     = require('shortid'),
    moment      = require('moment-timezone'),
    UserProfile = require('../../models/user_profile');

var buildCalendar = function(startTime, endTime, summary) {
  // Let's do a party right now
  var party = new iCalendar.EventBuilder();

  party.setStartDate(startTime);
  party.setEndDate(endTime);
  party.setSummary(summary);

  // Put that together in our calendar
  var calendar = new iCalendar.CalendarBuilder();
  calendar.addEvent(party.getEvent());

  // And display it
  return calendar.getCalendar().toString();
};

var sendConfirmationEmail = function(session, student, mentor) {
  var mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });
  var emailTemplate = Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/session-confirm.hbs'), 'utf-8'));
  var email_data = {
    from: 'no-reply@epicvisor.com',
    to: [extractEmail(mentor, mentor.mentor_profile), student.email]
  };
  var startTime = moment(session.startTime).tz('America/Los_Angeles').format('MMMM Do YYYY h:mm a');
  var endTime = moment(session.endTime).tz('America/Los_Angeles').format('MMMM Do YYYY h:mm a');
  email_data.subject = 'EpicSession Confirmed for ' + startTime + ' PT';
  var summary = 'Epicvisor Session For ' + mentor.first_name + ' ' + mentor.last_name + ' and ' + student.name;

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
};

var sendCancellationEmail = function(session, student, mentor, mentorProfile) {
  var mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  var emailTemplate = Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/session-cancel.hbs'), 'utf-8'));
  var email_data = {
    from: 'no-reply@epicvisor.com',
    to: [extractEmail(mentor, mentor.mentor_profile), student.email]
  };
  var beginTime = moment(session.date).tz('America/Los_Angeles').format('MMMM Do YYYY h:mm a');
  var startTime = startTime && moment(session.startTime).tz('America/Los_Angeles').format('MMMM Do YYYY @ h:mm a');
  var endTime = endTime && moment(session.endTime).tz('America/Los_Angeles').format('MMMM Do YYYY @ h:mm a');
  email_data.subject = 'EpicSession Cancelled for ' + (startTime || beginTime) + ' PT';
  var summary = 'Epicvisor Session Cancelled: ' + mentor.first_name + ' ' + mentor.last_name + ' and ' + student.name;
  email_data.html = emailTemplate({
    mentor: mentor,
    student: student,
    session: session,
    url: process.env.CALLBACK_URL,
    startTime: startTime,
    endTime: endTime,
    beginTime: beginTime
  });

  mailgun.messages().send(email_data, function(err, body) {
    if (err) {
      console.log(err);
    }
  });
}

function extractEmail(mentor, userProfile) {
    var mentorEmail = userProfile.preferred_email || mentor.email_address ;
    return mentorEmail;
}

/**
 * Builds the email based on type
 * @param  {object} emailData data for email
 * @param  {string} type      type (cancel, confirm, request)
 * @return {[type]}           [description]
 */
var buildHtml = function(emailData, type) {
  var emailTemplate = '';

  switch (type) {
    case 'cancel':
      emailData.subject = 'EpicVisor | Meeting Cancellation';
      emailTemplate = buildTemplate('session-cancel')(emailData);
      break;

    case 'confirm':
      emailData.subject = 'EpicVisor | Meeting Confirmation';
      emailTemplate = buildTemplate('session-confirm')(emailData);
      break;

    case 'request':
      emailData.subject = 'EpicVisor | Meeting Request';
      emailTemplate = buildTemplate('session-request-email')(emailData);
      break;

    default:
      break;
  };

  return emailTemplate;
};


var buildTemplate = function (partialName) {
  var partialPath = Path.resolve(__dirname, '../templates/' + partialName + '.hbs');
  // Read partial to store as variable
  var partialFile = fs.readFileSync(partialPath, 'utf-8');
  Handlebars.registerPartial('partial', partialFile);

  // Returns a handlebar function to take in params
  return Handlebars.compile(fs.readFileSync(
                              Path.resolve(__dirname, '../templates/base.hbs'),
                              'utf-8'));
};

var bookAndSendEmail = function(request, reply, student, mentor, userProfileSettings, userProfile) {
  var configs = {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  };

  var mailgun = new Mailgun(configs);
  var emailTemplate = Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/session-request-email.hbs'), 'utf-8'));

  var emailData = {
    participants: {
      from: 'no-reply@epicvisor.com',
      to: [extractEmail(mentor, userProfile), student.email],
      cc: 'no-reply@epicvisor.com',
    },
    content: {}
  };

  var bookingDetails = request.payload;
  bookingDetails.user_id = request.params.id;
  bookingDetails.encoded_url = shortid.generate();

  Sessions.create(bookingDetails).then(function(created) {
    var week = moment(request.payload.date).tz('America/Los_Angeles').startOf('week').format('MMMM Do YYYY');

    emailData.content = {
      mentor: mentor,
      userProfileSettings: userProfileSettings,
      student: student,
      session: created,
      url: process.env.CALLBACK_URL,
      week: week
    };

    // To offload logic on hbs
    if (created.topics.length > 0) {
      emailData.content.session.topicsExists = true;
    } else {
      emailData.content.session.topicsExists = false;
    }

    var email = emailData.participants;
    email.subject = 'EpicSession request for week of ' + week + ' ' + bookingDetails.encoded_url;
    email.html = buildHtml(emailData.content, 'request');

    mailgun.messages().send(email, function(err, body) {
      if (err) {
        console.log(err);
        reply('email not sent');
      } else {
        reply('email sent');
      }

      return created;
    });
  });
};

module.exports = {
  bookAndSendEmail: bookAndSendEmail,
  extractEmail: extractEmail,
  sendCancellationEmail: sendCancellationEmail,
};
