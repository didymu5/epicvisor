var scope = ['r_basicprofile',  'r_emailaddress'];
var User = require('../../models/user');
var Linkedin;
var callback_url;
var Handlebars = require('handlebars');
var fs = require('fs');
var Path = require('path');

exports.initialize = function(LinkedInModule) {
  Linkedin = LinkedInModule( process.env.LINKEDIN_API_KEY, process.env.LINKEDIN_API_SECRET);
  callback_url = process.env.CALLBACK_URL ;
  Linkedin.auth.setCallback(callback_url + '/oauth/linkedin/callback');
  
  return {
    linkedInOAUTH: linkedInOAUTH, 
    requestAuth: requestAuth
  }
}


function requestAuth(request, reply) {
   Linkedin.auth.authorize(reply, scope);

}

function sendLinkedInEmail(user) {
  var Mailgun = require('mailgun-js');

  // bookingDetails.user_id = encodeURIComponent(request.params.id);
  var emailTemplate = Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/register-mentor.hbs'), 'utf-8'));
  console.log("SENDING LE EMAIL!")
  console.log(user);
  var mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });
  var email_data = {
    from: 'no-reply@epicvisor.com',
    to: user.email_address,
    subject: 'Registered to epicvisor',
    html: emailTemplate({
      mentor: user
    })
  }
  mailgun.messages().send(email_data, function(err, body) {
    if (err) {
      throw err;
    }
    return body;
  });
}

function linkedInOAUTH(request, reply) {
   Linkedin.auth.getAccessToken(reply, request.query.code, request.query.state, function(err, results) {
        if ( err )
            return console.error(err);
        var linkedin = Linkedin.init(results.access_token);
        linkedin.people.me(['id','first-name','last-name','picture-url', 'headline','location','industry','summary','positions','specialties','public-profile-url','email-address'], function(err, $in) {
          var userDetails = {
            first_name: $in.firstName,
            last_name: $in.lastName,
            email_address: $in.emailAddress,
            industry: $in.industry,
            public_url: $in.publicProfileUrl,
            summary: $in.summary,
            headline: $in.headline,
            user_access_token: results.access_token,
            avatar: $in.pictureUrl,
            linkedin_id: $in.id,
            positions: $in.positions
          }
          User.findOrCreate({
            where: {
              linkedin_id: $in.id
            },
            defaults: userDetails}).then(function(userData,created) {
              if(created)
              {
                sendLinkedInEmail(userData[0])
              }
            userData[0].update(userDetails, {fields: Object.keys(userDetails)}).then(function(userData) {
              request.yar.set('user', userData);
              return reply.redirect('/index.html#/profile');
            });
          });
        });
    });
}
