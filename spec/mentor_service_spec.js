var chai = require('chai'),
    mocha = require('mocha'),
    expect = chai.expect;
import 'angular';
import 'angular-mocks';
import '../app/app';

describe('UserService', function() {
  beforeEach(module('app'));

  var userService, $httpBackend, $q;

  beforeEach(inject(function(_userService, _$httpBackend_, _$q_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    userService = _userService_;
    $q = _$q_;
    $httpBackend = $_httpBackend_;
  }));

  describe('gets user', function(done) {
    it('sets the strength to "strong" if the password length is >8 chars', function() {
      var $scope = {};
      $httpBackend.when('GET','/user/info').respond({userId: 2});
      var userPromise = userService.getUser();
      $httpBackend.flush();
      userPromise.then(function(user){
        expect(user.userId).to.equal(2)
        done()
      });
    });
  });
});