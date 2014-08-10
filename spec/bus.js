var expect = require('chai').expect;
var Bus = require("../js/bus");

describe('Bus', function() {

  var bus;
  beforeEach(function() {
    bus = new Bus();
  });

  describe('#on', function() {
    it('should register an event', function() {

      var fn = function() { return 1; };
      bus.on('tako', fn);

      expect(bus.getEvents('tako')).to.include(fn);
    });
  });

  describe('#emit', function() {
    it('should emit event and pass data', function() {
      var sharks = 0;
      bus.on('some-event', function(data) {
        sharks = data;
      });
      bus.emit('some-event', 1);
      expect(sharks).to.equal(1);
    });
  });

});
