var cellutil = {};

var aux = require("../helpers");

cellutil.randDir = function() {
  var move = [0, 0];
  var i = aux.rand(2);
  var j = aux.rand(2);
  if (j === 0) j -= 1;
  move[i] = j;
  return move;
};

cellutil.localCells = function(cell, map, distance) {
  return map.activeCells().filter(function(c) {
    return c.x >= cell.x - distance
        && c.x <= cell.x + distance
        && c.y >= cell.y - distance
        && c.y <= cell.y + distance;
  });
};

cellutil.notMyAi = function(cell) {
  return function(c) {
    return c.ai !== cell.ai;
  };
};

cellutil.manhattanDistance = function(a, b) {
  return Math.abs(b.x-a.x) + Math.abs(b.y-a.y);
};

cellutil.closestTo = function(cells, cell) {

  var closestCell;
  var closestCellDistance;

  cells.forEach(function(c) {
    var distance = cellutil.manhattanDistance(c, cell);
    if (!closestCellDistance || distance < closestCellDistance) {
      closestCell = c;
      closestCellDistance = distance;
    }
  });

  return closestCell;
};

cellutil.vectorTo = function(a, b) {
  var dx = 0;
  var dy = 0;
  if (b.x > a.x) dx =  1;
  if (b.x < a.x) dx = -1;
  if (b.y > a.y) dy =  1;
  if (b.y < a.y) dy = -1;
  return {x: dx, y: dy};
};

module.exports = cellutil;
