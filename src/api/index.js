  'use strict';
var Linkedin = require('node-linkedin')( '753q6tuln2wr0s', 'lK27ABwIJOYFe8Uz');//TODO put id/secret in config file
var callback_url = process.env.CALLBACK_URL || "https://arcane-badlands-87546.herokuapp.com";
Linkedin.auth.setCallback(callback_url + '/oauth/linkedin/callback');

var scope = ['r_basicprofile',  'r_emailaddress'];
var User = require('../../models/user');
function sayHello(request, reply) {

  reply({
    hello: request.params.name
  });
}

function sayLinkedinHello(request, reply){
  var linkedin = Linkedin.init(request.params.accessToken);
  linkedin.people.me([
    'id',
    'first-name',
    'last-name', 
    'headline',
    'location',
    'industry',
    'summary',
    'positions',
    'specialties',
    'public-profile-url',
    'email-address'], function(err, $in) {
      if(err) return err;
      reply($in);
  });
  
}

function getUserInfo(request, reply) {
  console.log("HI MOM!")
  var user = request.yar.get('user');
  reply(user);  
}

var handler1 = function (request, reply) {

    request.yar.set('example', 'sample_value');
    return reply("YUP!");
};

var handler2 = function (request, reply) {

    var example = request.yar.get('example');
    reply(example);     // Will send back 'value'
};

function requestAuth(request, reply) {
   Linkedin.auth.authorize(reply, scope);
}

function linkedInOAUTH(request, reply) {
   Linkedin.auth.getAccessToken(reply, request.query.code, request.query.state, function(err, results) {
        if ( err )
            return console.error(err);
        var linkedin = Linkedin.init(results.access_token);
        linkedin.people.me(['id','first-name','last-name', 'headline','location','industry','summary','positions','specialties','public-profile-url','email-address'], function(err, $in) {
          User.findOrCreate({
            where: {
              linkedin_id: $in.id
            },
            defaults: {
            first_name: $in.firstName,
            last_name: $in.lastName,
            email_address: $in.emailAddress,
            industry: $in.industry,
            public_url: $in.publicProfileUrl,
            summary: $in.summary,
            headline: $in.headline,
            user_access_token: results.access_token,
            linkedin_id: $in.id
          }}).then(function(userData) {
            request.yar.set('user', userData[0]);
            return reply.redirect('/index.html');
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

  server.route({
    method: 'GET',
    path: '/user/info',
    handler: getUserInfo
  });
   server.route({
    method: 'GET',
    path: '/handler1',
    handler: handler1
  });
    server.route({
    method: 'GET',
    path: '/handler2',
    handler: handler2
  });

  return next();
}

register.attributes = {
  name: 'api'
};

module.exports = register;
