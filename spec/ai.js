var expect = require('chai').expect;
var aiLibrary = require("../js/cells/library");

Object.keys(aiLibrary).forEach(function(key) {
  var ai = aiLibrary[key];

  describe('AI: '+key, function() {

    it('should be an object', function() {
      expect(ai).to.be.an('object');
    });

    it('should have a tick function', function() {
      expect(ai.tick).to.be.a('function');
    });

    describe('#tick', function() {
      it('should return an object with x and y', function() {
        var cell = {
          x: 4,
          y: 4,
          id: 4,
          ai: key
        };
        var world = {
          age: 21,
          map: {
            at: function() {},
            activeCells: function() {
              return []
            }
          }
        };
        var move = ai.tick(cell, world);
        expect(move).to.be.an('object');
        expect(move.x).to.be.a('number');
        expect(move.y).to.be.a('number');
      });
    });

  });
});


