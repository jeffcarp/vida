var protoai = {};

var cellutil = require("./util");
var aux = require("../helpers");

protoai.passEnergy = 100;
protoai.reproductionRate = 3;
protoai.childhood = 5;

var closestNeighbor = function(cell, neighborhood) {
  var closest = null;
  var closestDist = 1e6;
  for (var i in neighborhood) {
    for (var j in neighborhood[i]) {
      var c = neighborhood[i][j];
      if (!c) continue;
      var dist = distanceTo(c, cell);
      if (dist < closestDist && notRelated(cell, c)) {
        closest = c;
        closestDist = dist;
      }
    } 
  } 
  return closest;
};

var notRelated = function(a, b) {
  if (!a || !b) return false;
  if (a.id === b.id) return false;

  return a.lineage.some(function(x) {
    return b.lineage.indexOf(x) == -1;
  });
};

var vacantSpot = function(target) {
  // TODO: Return best spot
/*
  var vec = [0, 0];
  var i = aux.rand(2);
  if (aux.rand(2) === 1) vec[i] = 1; 
  else vec[i] = -1;
*/
  return [target.x+1, target.y];
};

var at = function(x, y, neighborhood) {
  return neighborhood[x] && neighborhood[x][y];
};

var vectorToward = function(x, y, cell) {
  
  var dx = 0,
      dy = 0;
  if (cell.age % 2 == 0) {
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
//  if (cell.age > protoai.childhood && cell.age % protoai.reproductionRate == 0 && cell.energy > protoai.passEnergy) {
 //   return [2, 2]; // Reproduce
 // }


  // Composable block
  if (cell.age > protoai.childhood) {
  
    // If another cell is already in our VN neighborhood, EAT IT (unless it's our child)
    // Grab cells in von neumann neighborhood
    var soba = vnn(cell, neighborhood);
    for (var dir in soba) {
      var adj = soba[dir];
      // No cannibalism please
      if (adj && notRelated(cell, adj)) {
        // TODO: Distance to prey should be enforced in runner
        if (distanceTo(cell, adj) < 3) { 
          return ({
            type: "eat",
            target: adj
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
      return vectorToward(target[0], target[1], cell);
    }
  }

  return cellutil.randDir();
};

module.exports = protoai;
