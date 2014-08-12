var expect = require('chai').expect;
var cu = require("../js/cells/util");

describe('cellutil', function() {

  describe('#manhattanDistance', function() {
    it('computes normally', function() {
      var a = {x: 5, y: 6};
      var b = {x: 10, y: 8};
      var distance = cu.manhattanDistance(a, b);
      expect(distance).to.equal(7);
    });

    it('returns 0 when they\'re the same', function() {
      var a = {x: 5, y: 6};
      var b = {x: 5, y: 6};
      var distance = cu.manhattanDistance(a, b);
      expect(distance).to.equal(0);
    });
  });

  describe('#closestTo', function() {

    it('returns the closest cell', function() {
      var cells = [
        {x: 10, y: -12},
        {x: 5,  y: 6},
        {x: -6, y: 4}
      ];
      var cell = {x: 5, y: 5};
      var closest = cu.closestTo(cells, cell);
      expect(closest.x).to.equal(5);
      expect(closest.y).to.equal(6);
    });

    it('returns null if no cells given', function() {
      var cell = {x: 5, y: 5};
      var closest = cu.closestTo([], cell);
      expect(closest).to.equal(undefined);
    });

  });

  describe('#vectorTo', function(a, b) {

    it('goes southeast', function() {
      var a = {x: 5, y: 5};
      var b = {x: 10, y: -10};
      var vector = cu.vectorTo(a, b);
      expect(vector.x).to.equal(1);
      expect(vector.y).to.equal(-1);
    });

    it('goes west', function() {
      var a = {x: 5, y: 5};
      var b = {x: -10, y: 5};
      var vector = cu.vectorTo(a, b);
      expect(vector.x).to.equal(-1);
      expect(vector.y).to.equal(0);
    });

    it('goes north', function() {
      var a = {x: 5, y: 5};
      var b = {x: 5, y: 10};
      var vector = cu.vectorTo(a, b);
      expect(vector.x).to.equal(0);
      expect(vector.y).to.equal(1);
    });
  });
});

