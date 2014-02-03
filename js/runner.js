// Vida Runner
var runner = {};

// Dependencies
var render = require("./render"),
    protoai = require("./protoai"),
    aux = require("./helpers");

var game = {
  cells: [],
  time: 0
};
var config = {};

runner.init = function(userConfig) {
  config = runner.defaultConfig(userConfig);

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
  for (var i=0; i<20; i++) {
    cells.push({
      x: aux.rand(50)-25, 
      y: aux.rand(50)-25, 
      age: 0
    });
  }
  return cells;
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
    if (!runner.cellExists(desiredX, desiredY)) {
      cell.x = desiredX;
      cell.y = desiredY;
    }
    
  });

  render.setVars(game, config);

};

runner.cellExists = function(x, y) {
  return game.cells.some(function(c) {
    return c.x == x && c.y == y;
  });
};

runner.vacant = function(x, y) {
  // TODO: Add outOfBounds()
  return !runner.cellExists(x, y); 
};

runner.validMove = function(move) {
  return (
    move
    && move.length == 2
    && (move[0] === 0 || move[1] === 0)
  );
};

module.exports = runner;
