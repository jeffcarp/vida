var tiger = module.exports = {};

var cu = require('./util');

// world would be an object with age, population, etc.

var noop = {x: 0, y: 0};

tiger.tick = function(cell, world) {
  var locals = cu.localCells(cell, world.map, 100);
  if (!locals.length) {
    //console.log('no locals', cell);
    return noop;
  }

  var enemies = locals.filter(cu.notMyAi(cell));
  if (!enemies.length) {
    //console.log('no enemies', cell);
    return noop;
  }

  var closest = cu.closestTo(enemies, cell);
  var vector = cu.vectorTo(cell, closest);

  return vector;
};
