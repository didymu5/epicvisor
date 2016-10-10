var scope = ['r_basicprofile', 'r_emailaddress'];
var User = require('../../models/user');
var Linkedin;
var callback_url;
var Handlebars = require('handlebars');
var fs = require('fs');
var Path = require('path');

exports.initialize = function(LinkedInModule) {
  Linkedin = LinkedInModule(process.env.LINKEDIN_API_KEY, process.env.LINKEDIN_API_SECRET);

  return {
    linkedInOAUTH: linkedInOAUTH,
    requestAuth: requestAuth,
    linkedInSignBackIn: linkedInSignBackIn,
    linkedInSignIn: linkedInSignIn,
    logout: logout,
    refreshLinkedIn: refreshLinkedIn
  }
}


function requestAuth(request, reply) {
  callback_url = process.env.CALLBACK_URL;
  Linkedin.auth.setCallback(callback_url + '/oauth/linkedin/callback');
  Linkedin.auth.authorize(reply, scope);
}

function sendLinkedInEmail(user) {
  var Mailgun = require('mailgun-js');

  // bookingDetails.user_id = encodeURIComponent(request.params.id);
  var emailTemplate = Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, '../templates/register-mentor.hbs'), 'utf-8'));

  var mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });
  var email_data = {
    from: 'no-reply@epicvisor.com',
    to: user.email_address,
    subject: 'Welcome to EpicVisor!',
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

function refreshLinkedIn(request, reply) {
  access_token = request.yar.get('user').user_access_token;
  if(process.env.FAKE_USER) {
    reply(request.yar.get("user"));
  }
  else {
    var linkedin = Linkedin.init(access_token);
    linkedin.people.me(['id', 'first-name', 'last-name', 'picture-url', 'headline', 'location', 'industry', 'summary', 'positions', 'specialties', 'public-profile-url', 'email-address'], 
      function(err, $in) {
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
      };
      User.findOrCreate({
        where: {
          linkedin_id: $in.id
        },
        defaults: userDetails
      }).spread(function(userData, justCreated) {
        userDetails.role =  userData.role || 'mentor';
        userData.update(userDetails, {
          fields: Object.keys(userDetails)
        }).then(function(userData) {
          request.yar.set('user', userData);
          return reply(userData);
        });
      });


    });
  }
}

function linkedInSignBackIn(request, reply) {
  Linkedin.auth.getAccessToken(reply, request.query.code, request.query.state, function(err, results) {
    if (err) {
      throw err;
    }
    var linkedin = Linkedin.init(results.access_token);
    linkedin.people.me(['email-address'], function(err, $in) {
      if (err) {
        throw err;
      }
      User.findOne({
        where: {
          email_address: $in.emailAddress
        }
      }).then(function(user) {
        if(user){
          request.yar.set('user', user);
          if(request.yar.get('redirect_url')) {
            reply.redirect('/#' + request.yar.get('redirect_url'))
          }
          else {
            reply.redirect('/#/profile');
          }
        } else {
          reply.redirect('/#/join');
        }
        return user;
      });
    })
  })
}

function logout(request, reply) {
  request.yar.set('user', null);
  console.log(request.yar);
  return reply.redirect('/');
}

function linkedInSignIn(request, reply) {
  // if stubbing out or working around mitm ssl issues, this is the way to go
  if(process.env.FAKE_USER) {
    console.log("THE CATS MEOW!")
    User.findOne().then(function(user) {
      request.yar.set('user', user);
      return reply.redirect('/#/profile');      
    })
    return ;
  }
  // otherwise actually do linked in stuff
  callback_url = process.env.CALLBACK_URL;
  request.yar.set('redirect_url', request.query.reroute);
  Linkedin.auth.setCallback(callback_url + '/oauth/linkedin/callback/login');
  Linkedin.auth.authorize(reply, scope);
}

function linkedInOAUTH(request, reply) {
  Linkedin.auth.getAccessToken(reply, request.query.code, request.query.state, function(err, results) {
    if (err) {
      throw err;
    }

    var linkedin = Linkedin.init(results.access_token);
    linkedin.people.me(['id', 'first-name', 'last-name', 'picture-url', 'headline', 'location', 'industry', 'summary', 'positions', 'specialties', 'public-profile-url', 'email-address'], function(err, $in) {
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
        defaults: userDetails
      }).spread(function(userData, justCreated) {
        if (justCreated) {
          sendLinkedInEmail(userData)
        }
        userDetails.role =  userData.role || 'mentor';

        userData.update(userDetails, {
          fields: Object.keys(userDetails)
        }).then(function(userData) {
          request.yar.set('user', userData);
          return reply.redirect('/#/start/3');
        });
      });
    });
  });
}