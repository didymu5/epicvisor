var Linkedin = require('node-linkedin')( '753q6tuln2wr0s', 'lK27ABwIJOYFe8Uz');//TODO put id/secret in config file
Linkedin.auth.setCallback('https://arcane-badlands-87546.herokuapp.com/oauth/linkedin/callback');
var scope = ['r_basicprofile',  'r_emailaddress'];
var User = require('./models/user');
function sayHello(request, reply) {
  'use strict';

  reply({
    hello: request.params.name
  });
}

function sayLinkedinHello(request, reply){
  var linkedin = Linkedin.init(request.params.accessToken);
  linkedin.people.me(['id','first-name','last-name', 'headline','location','industry','summary','positions','specialties','public-profile-url','email-address'], function(err, $in) {
    reply($in);
  });
  
}

function requestAuth(request, reply) {
  'use strict';
   Linkedin.auth.authorize(reply, scope);
}

function linkedInOAUTH(request, reply) {
   Linkedin.auth.getAccessToken(reply, request.query.code, request.query.state, function(err, results) {
        if ( err )
            return console.error(err);
        var linkedin = Linkedin.init(results.access_token);
        linkedin.people.me(['id','first-name','last-name', 'headline','location','industry','summary','positions','specialties','public-profile-url','email-address'], function(err, $in) {
          user.create({
            first_name: $in["firstName"],
            last_name: $in["lastName"],
            email_address: $in["emailAddress"],
            industry: $in["industry"],
            public_url: $in["publicProfileUrl"],
            summary: $in["summary"],
            headline: $in["headline"],
            user_access_token: results.access_token
          }).then(function(user) {
            return reply.redirect('/profile');
          });
        });
    });
}

function register(server, options, next) {
  'use strict';

  server.route({
    method: 'GET',
    path: '/hello/{name}',
    handler: sayHello
  });


  server.route({
    method: 'GET',
    path: '/oauth/linkedin/callback',
    handler: linkedInOAUTH
  });
  server.route({
    method: 'GET',
    path: '/info/{accessToken}',
    handler: sayLinkedinHello
  });
  server.route({
    method: 'GET',
    path: '/oauth/linkedin',
    handler: requestAuth
  });

  return next();
}

register.attributes = {
  name: 'api'
};

module.exports = register;
