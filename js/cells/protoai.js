var protoai = {};

var cellutil = require("./util");
var aux = require("../helpers");

protoai.passEnergy = 40;

var closestNeighbor = function(cell, neighborhood) {
  var closest = null;
  var closestDist = 1e6;
  for (var i in neighborhood) {
    for (var j in neighborhood[i]) {
      var c = neighborhood[i][j];
      var dist = distanceTo(c, cell);
      if (dist < closestDist && !related(cell, c)) {
        closest = neighborhood[i][j];
        closestDist = dist;
      }
    } 
  } 
  return closest;
};

var related = function(a, b) {
  return a.parent !== b.id && b.parent !== a.id;
};

var vacantSpot = function(cell) {
  // TODO: Return best spot
  return [cell.x+1, cell.y];
};

var at = function(x, y, neighborhood) {
  if (x in neighborhood && y in neighborhood[x]) return neighborhood[x][y];
  else return null;
};

var vectorToward = function(x, y, cell) {
  var dx = 0,
      dy = 0;
  if (cell.x !== x) {
    if (x > cell.x) dx = 1; 
    if (x < cell.x) dx = -1; 
    return [dx, 0];
  }
  else {
    if (y > cell.y) dy = 1; 
    if (y < cell.y) dy = -1; 
    return [0, dy];
  }
};

var distanceTo = function(to, from) {
  var x = to.x - from.x;
  var y = to.y - from.y;
  return Math.abs(x) + Math.abs(y);
};

var vnn = function(cell, neighborhood) {
  return {
    left: at(cell.x-1, cell.y, neighborhood),
    right: at(cell.x+1, cell.y, neighborhood),
    up: at(cell.x, cell.y-1, neighborhood),
    down: at(cell.x, cell.y+1, neighborhood)
  };
};

protoai.tick = function(cell, neighborhood, messages, time) {

  // Composable block
  if (cell.age > 100 && cell.age % 25 == 0 && cell.energy > (protoai.passEnergy*2)) {
    return [2, 2]; // Reproduce
  }

  // Composable block
  if (1 == 1) {
  
    // If another cell is already in our VN neighborhood, EAT IT (unless it's our child)
    // Grab cells in von neumann neighborhood
    var soba = vnn(cell, neighborhood);
    for (var dir in soba) {
      var adj = soba[dir];
      // No cannibalism please
      if (adj && adj.id !== cell.id && !related(cell, adj)) {
        // TODO: Distance to prey should be enforced in runner
        if (distanceTo(cell, adj) === 1) { 
          return ({
            type: "eat",
            x: adj.x,
            y: adj.y
          });
        }
      }
    }

    // Locate the closest prey cell
    var prey = closestNeighbor(cell, neighborhood);
    if (prey) {
      // Locate a vacant spot in its von neumann neighborhood
      var target = vacantSpot(prey);
      // Return the direction that would take us closest to that cell 
      var vec = vectorToward(target[0], target[1], cell);
      return vec;
    }
  }

  return cellutil.randDir();
};

module.exports = protoai;
