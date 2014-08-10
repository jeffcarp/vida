var expect = require('chai').expect;
var bus = require("../js/bus");

describe('bus', function() {

  it('is an object', function() {
    expect(bus).to.be.an('object');
  });

  it('has a cellBuffer property', function() {
    expect(bus.cellBuffer).to.be.an('object');
  });
});
