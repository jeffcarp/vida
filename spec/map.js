var expect = require('chai').expect;
var Map = require("../js/map");

describe('Map', function() {

  var map;
  beforeEach(function() {
    map = new Map({
      width: 99,
      height: 99
    });
  });

  describe('constructor', function() {
    it('takes width and height options', function() {
      expect(map.width).to.equal(99);
      expect(map.height).to.equal(99);
    });
  });

  describe('#at', function() {
    it('returns nothing if nothing is there', function() {
      expect(map.at(5, 5)).to.be.null;
    });

    it('returns a cell if it is there', function() {
      var cell = {id: 9};
      map.place(cell, 5, 5);
      expect(map.at(5, 5)).to.equal(cell);
    });
  });

  describe('#idAt', function() {
    it('returns nothing if nothing is there', function() {
      expect(map.idAt(5, 5)).to.be.null;
    });

    it('returns a cell if it is there', function() {
      map.place({id: 9}, 5, 5);
      expect(map.idAt(5, 5)).to.equal(9);
    });
  });

  describe('#place', function() {
    it('should return false if cell is invalid', function() {
      expect(map.place({}, 5, 5)).to.be.false;
    });

    it('should return true if successful and store it', function() {
      var res = map.place({id: 8}, 5, 5);
      expect(res).to.be.true;
      expect(Object.keys(map.cells).length).to.equal(1);
    });

    it('should return false if spot is occupied and not store it', function() {
      map.place({id: 8}, 5, 5);
      expect(map.place({id: 9}, 5, 5)).to.be.false;
      expect(Object.keys(map.cells).length).to.equal(1);
    });
  });

  describe('#vacant', function() {
    it('returns true if a spot is vacant', function() {
      expect(map.vacant(5, 5)).to.be.true;
    });

    it('returns false if a spot is occupied', function() {
      map.place({id: 9}, 5, 5);
      expect(map.vacant(5, 5)).to.be.false;
    });
  });

  describe('#move', function() {

    it('returns false if no cell available', function() {
      map.place({id: 9}, 5, 5);
      expect(map.move([5, 6], [5, 7])).to.be.false;
    });

    it('returns false if spot is occupied', function() {
      map.place({id: 7}, 5, 5);
      map.place({id: 9}, 5, 6);
      expect(map.move([5, 6], [5, 5])).to.be.false;
    });

    it('returns true if move is successful', function() {
      map.place({id: 9}, 5, 5);
      expect(map.move([5, 5], [5, 6])).to.be.true;
      expect(map.vacant(5, 5)).to.equal(true);
      expect(map.idAt(5, 6)).to.equal(9);
    });
  });

  describe('#removeById', function() {
    it('returns false if no cell available', function() {
      map.place({id: 9}, 5, 5);
      expect(map.removeById(7)).to.be.false;
    });

    it('returns true if removal is successful', function() {
      map.place({id: 9}, 5, 5);
      expect(map.removeById(9)).to.be.true;
      expect(Object.keys(map.cells).length).to.equal(0);
      expect(Object.keys(map.graph).length).to.equal(0);
    });
  });

  describe('#activeCells', function() {
    it('returns an empty array if no cells', function() {
      expect(map.activeCells()).to.be.an('array');
      expect(map.activeCells()).to.be.empty;
    });

    it('returns true if removal is successful', function() {
      map.place({id: 5}, 5, 5);
      map.place({id: 6}, 5, 6);
      map.place({id: 7}, 5, 7);
      var cells = map.activeCells();
      expect(cells.length).to.equal(3);
    });
  });

});
