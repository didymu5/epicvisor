var scope = ['r_basicprofile',  'r_emailaddress'];
var User = require('../../models/user');
var Linkedin;
var callback_url;
exports.initialize = function(LinkedInModule) {
  Linkedin = LinkedInModule( '753q6tuln2wr0s', 'lK27ABwIJOYFe8Uz');
  callback_url = process.env.CALLBACK_URL || "https://arcane-badlands-87546.herokuapp.com";
  Linkedin.auth.setCallback(callback_url + '/oauth/linkedin/callback');
  
  return {
    linkedInOAUTH: linkedInOAUTH, 
    requestAuth: requestAuth
  }
}


function requestAuth(request, reply) {
   Linkedin.auth.authorize(reply, scope);

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
            defaults: userDetails}).then(function(userData) {
            userData[0].update(userDetails, {fields: Object.keys(userDetails)}).then(function(userData) {
              request.yar.set('user', userData);
              return reply.redirect('/index.html#/profile');
            });
          });
        });
    });
}
