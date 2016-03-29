var sendgrid  = require('sendgrid')('app48036776@heroku.com','ryemxjqt8429' );
sendgrid.send({
  to:       ['ian.norris.1991@gmail.com','wu.thomas@gmail.com'],
  from:     'epicvisordonotreply@gmail.com',
  subject:  'Hello World',
  text:     'My first email through SendGrid.'
}, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
});
