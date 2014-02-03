// Vida Runner
var runner = {};

// Dependencies
var render = require("./render");

var protoai = require("./protoai");

var game = {
  cells: [],
  tunnels: [],
  bases: [],
  time: 0
};
var config = {};

runner.init = function(userConfig) {
  config = runner.defaultConfig(userConfig);

  runner.generateBases(); // could be refactored to be more functional
  game.cells = runner.generateCells();

  // Hack to wait for DOM to load
  window.setTimeout(function() {
    render.setVars(game, config);
    render.init(config);
  }, 75);

  window.setInterval(function() {
    runner.tickAllCells();
  }, config.speed);
};

// Returns a clean slate of cells
runner.generateCells = function() {
  var cells = [];
  game.bases.forEach(function(b) {
    cells.push({x: b.x+1, y: b.y+1, age: 0});
    cells.push({x: b.x-1, y: b.y+1, age: 0});

    cells.push({x: b.x-1, y: b.y, age: 0});
    cells.push({x: b.x+1, y: b.y, age: 0});

    cells.push({x: b.x+1, y: b.y-1, age: 0});
    cells.push({x: b.x-1, y: b.y-1, age: 0});
  });
  return cells;
};

runner.generateBases = function() {

  game.bases.push({
    x: 0,
    y: 0
  });

  // TODO: generate a base and tunnels surrounding it
  var tunnels = [];
  var hsize = 5;
  for (var i = (-hsize); i<=hsize; i++) {
    for (var j = (-hsize); j<=hsize; j++) {
      if (i == 0 && j == 0) continue;
      tunnels.push({x: i, y: j});
    }
  }

  game.tunnels = tunnels;
};

runner.defaultConfig = function(userConfig) {
  var mapSize = userConfig.mapSize || 100;
  return ({
    mapSize: mapSize,
    startingNum: mapSize / 2,
    blockSize: userConfig.blockSize || 2,
    speed: userConfig.speed || 100,
    maxTurn: Math.pow(mapSize, 2)
  });
};

runner.tickAllCells = function() {

  game.time += 1;

  // For each cell
  game.cells.forEach(function(cell) {

    // See if there are any messages
    cell.age += 1;

    // Cells die of old age
    // TODO: figure out reproduction
/*
    if (cell.age > 40) {
      var i = game.cells.indexOf(cell);
      if (i != -1) game.cells.splice(i, 1);
    }
*/

    // Get its desired move
    var move = protoai.tick(cell, {}, [], game.time);

    if (!runner.validMove(move)) return;

    var desiredX = cell.x + move[0];
    var desiredY = cell.y + move[1];

    // TODO: If valid
    if (!runner.tunnelExists(desiredX, desiredY)) {
      game.tunnels.push({
        x: desiredX, 
        y: desiredY
      });
    }

    if (!runner.cellExists(desiredX, desiredY)) {
      cell.x = desiredX;
      cell.y = desiredY;
    }
    
  });

  render.setVars(game, config);

};

runner.tunnelExists = function(x, y) {
  return game.tunnels.some(function(t) {
    return t.x == x && t.y == y;
  })
};

runner.cellExists = function(x, y) {
  return game.cells.some(function(c) {
    return c.x == x && c.y == y;
  });
};

runner.baseExists = function(x, y) {
  return game.bases.some(function(c) {
    return c.x == x && c.y == y;
  });
};

runner.vacant = function(x, y) {
  return runner.tunnelExists(x, y) && !runner.cellExists(x, y) && !runner.baseExists(x, y);
};

runner.validMove = function(move) {
  return (
    move
    && move.length == 2
    && (move[0] === 0 || move[1] === 0)
  );
};

module.exports = runner;
