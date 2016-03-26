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
});
