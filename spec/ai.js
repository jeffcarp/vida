var expect = require('chai').expect;
var ai = require("../js/cells/prototype");

describe('Any AI (now prototype)', function() {

  it('should be an object', function() {
    expect(ai).to.be.an('object');
  });

  it('should have a tick function', function() {
    expect(ai.tick).to.be.a('function');
  });

  describe('#tick', function() {
    it('should return a two element array', function() {
      expect(ai.tick()).to.be.an('array');
    });
  });

});

