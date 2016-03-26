process.env["NODE_ENV"] = "test";
    process.env["CALLBACK_URL"] = "testurl";

var Code = require('code');
var Lab = require('lab');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var before = lab.before;
var after = lab.after;
var it = lab.it;
var expect = Code.expect;
var User = require('../../models/user');
var linkedInSpy = {auth: {}};
var mockLinkedIn = function(apiKey, apiSecret) {
  var apiKey = apiKey;
  var apiSecret = apiSecret;
  var callback;
  linkedInSpy.getApiKeyAndSecret = function() {
    return [apiKey, apiSecret];
  }
  linkedInSpy.auth.setCallback = function(newCallback) {
    callback = newCallback;
  }
  linkedInSpy.getCallback = function(){
    return callback;
  }
  return linkedInSpy;
}

describe('Redirect to authorization', function() {
  'use strict';

  before(function(done) {
    var db_setup = require('../setup/db_setup');
    return db_setup.prepare().then(function() {
      console.log("SU!");
      done();
    });
  });

  it('tries to authenticate with scope', function(done) {
    var replyThingie = {};
    var reply, scope;
    linkedInSpy.auth.authorize = function(reply, newScope) {
      reply = reply;
      scope = newScope;
    };
    process.env["CALLBACK_URL"] = "testurl";
    var linkedInController = require('../../src/api/linked_in_controller').initialize(mockLinkedIn);
    linkedInController.requestAuth({}, replyThingie);
    expect(scope).to.deep.equal(["r_basicprofile", "r_emailaddress"]);
    expect(linkedInSpy.getCallback()).to.equal("testurl/oauth/linkedin/callback");
    done();
  });
  it("does oAuth", function(done) {

    var linkedInClient = {
      people: {
        me: function(stuffs, linkedInFn) {
          expect(stuffs).to.deep.equal( [
        "id",
        "first-name",
        "last-name",
        "picture-url",
        "headline",
        "location",
        "industry",
        "summary",
        "positions",
        "specialties",
        "public-profile-url",
        "email-address"
      ]);
          linkedInFn(undefined, {
            firstName: 'Ian',
            lastName: 'Norris',
            id: 'boop'
          });
        }
      } 
    }
    var replyThingie = {redirect: function(url) {
      expect(url).to.equal("/index.html#/profile");
      User.findOne().then(function(user) {
        expect(user.first_name).to.equal('Ian');
        expect(user.last_name).to.equal('Norris');
        expect(user.linkedin_id).to.equal('boop');
        done();
      });
    }};
    var request = {
      yar: {
        set: function(attrName, attrValue) {
          expect(attrName).to.equal("user")
          expect(attrValue.id).to.equal(1);
        }
      },
      query: {
        code: 'code',
        state: 'state'
      }
    }
    var reply, scope;
    linkedInSpy.auth.getAccessToken = function(reply, code, state, callback) {
      expect(code).to.equal('code');
      expect(state).to.equal('state');
      callback(undefined, {access_token: 'superSecretToken'});
    };
    linkedInSpy.init = function(access_token) {
      expect(access_token).to.equal('superSecretToken');
      return linkedInClient;
    }
    var linkedInController = require('../../src/api/linked_in_controller').initialize(mockLinkedIn);
    linkedInController.linkedInOAUTH(request, replyThingie);
  })
});
