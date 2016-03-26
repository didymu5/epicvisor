process.env["NODE_ENV"] = "test";

var Code = require('code');
var Lab = require('lab');
var api = require('../src/api');
var mockServer = require('./mocks/server');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var before = lab.before;
var after = lab.after;
var it = lab.it;
var expect = Code.expect;
var User = require('../models/user');
var UserProfile = require('../models/user_profile');
var UserProfileSessionSettings = require('../models/user_profile_session_settings');

var server;

before((done) => {
  'use strict';
  mockServer(function(obj) {
    server = obj;
    server.register([{
      register: api
    }], done);
  });
});

after((done) => {
  'use strict';
  server.stop(done);
});

describe('Mentors API', function() {
  'use strict';

  it('gets all mentors', function(done) {
    var options = {
      method: 'GET',
      url: '/mentors'
    };
    return User.create({
        first_name: "Bob",
        last_name: "Dole"
      }).
    then(function(userCreated) {
      var userId = userCreated.id;
      return UserProfile.create({
        user_id: userId,
        year: "2013",
        blurb:"a blurb"
      }).then(function(){
        return UserProfileSessionSettings.create({
          user_id: userId,
          topics: ['career stuff','nepotism']
        })
      })
    }). 
    then(function() {
      return server.inject(options, (resp) => {
        var users = resp.request.response.source;
        expect(resp.statusCode).to.equal(200);
        expect(users.length).to.equal(1);
        expect(users[0].first_name).to.equal("Bob");
        expect(users[0].last_name).to.equal("Dole");
        expect(users[0].year).to.equal("2013");
        expect(users[0].blurb).to.equal("a blurb");
        expect(users[0].topics).to.deep.equal(['career stuff', 'nepotism']);

        done();
      });
    });
    
  });
});
