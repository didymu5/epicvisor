var Linkedin = require('node-linkedin')( '753q6tuln2wr0s', 'lK27ABwIJOYFe8Uz');//TODO put id/secret in config file
Linkedin.auth.setCallback('https://arcane-badlands-87546.herokuapp.com/oauth/linkedin/callback');
var scope = ['r_basicprofile',  'r_emailaddress'];

function sayHello(request, reply) {
  'use strict';

  reply({
    hello: request.params.name
  });
}

function sayLinkedInHello(request, reply){
  var linkedin = Linkedin.init(request.params.accessToken);
  console.log("IM ATTEMPTING TO ACCESS WITH" + request.params.accessToken);
  linkedin.people.me(['id','first-name','last-name'], function(err, $in) {
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

        console.log("I AUTHENTICATED WITH LINKEDIN!")

        console.log(results);
        console.log("DID THAT RETURN RESULTS?");
        return reply.redirect('/info/' + results.access_token );
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
