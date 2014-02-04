// Vida Runner
var runner = {};

// Dependencies
var render = require("./render"),
    aux = require("./helpers");

var ais = {
  "protoai": require("./cells/protoai"),
  "food": require("./cells/food"),
  "rando": require("./cells/rando") 
};

var game = {
  cells: [],
  time: 0
};
var config = {};

runner.init = function(userConfig) {
  config = runner.defaultConfig(userConfig);

  runner.generateCells();
  runner.generateFood();

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
  var num = 50;
  for (var i=0; i<num; i++) {
    runner.createCell({
      x: aux.rand(num*4)-num*2, 
      y: aux.rand(num*4)-num*2,
      ai: "protoai"
    });
  }
};

runner.generateFood = function() {
  var cells = [];
  for (var i=0; i<5; i++) {
    runner.createCell({
      x: aux.rand(50)-25, 
      y: aux.rand(50)-25,
      type: "food",
      ai: "food"
    });
  }
};

runner.createCell = function(options) {
  if (isNaN(options.x)) return; 
  if (isNaN(options.y)) return; 
  if (!ais[options.ai]) return;
  game.cells.push({
    x: options.x,
    y: options.y,
    age: 0,
    ai: options.ai,
    type: options.type || "cell",
    color: !isNaN(options.color) ? options.color+1 : 0 
  });
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
    if (cell.age > 30) {
      var death = aux.rand(100 - cell.age);
      if (death < 2) {
        runner.removeCell(cell);
      }
    }

    // Cells die of overcrowding
    var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    var atari = dirs.some(function(d) {
      return runner.vacant(cell.x+d[0], cell.y+d[1]);
    });
    if (!atari) {
      runner.removeCell(cell);
    }

    // Get its desired move
    // TODO: Pass in neighborhood
    // TODO: Pass in messages
    var neighborhood = {}; 
    var messages = []; 
    var move = ais[cell.ai].tick(cell, neighborhood, messages, game.time);

    // Cell wants to reproduce
    // TEMPORARILY CAP CELL GROWTH
    if (move[0] === 2 && move[1] === 2 && game.cells.length < 200) { 
      if (runner.vacant(cell.x+1, cell.y)) {

        // TODO: Introduce genetic mutation here
        // TODO: Make reproduction take a lot of resources
        runner.createCell({
          x: cell.x+1, 
          y: cell.y,
          ai: cell.ai,
          type: cell.type,
          color: cell.color
        });

        cell.age = 80;
      
      }
    }
    else {

      if (!runner.validMove(move)) return;

      var desiredX = cell.x + move[0];
      var desiredY = cell.y + move[1];

      // TODO: If valid
      if (!runner.cellExists(desiredX, desiredY)) {
        cell.x = desiredX;
        cell.y = desiredY;
      }
    }
    
  });

  render.setVars(game, config);

};

runner.removeCell = function(cell) {
  var i = game.cells.indexOf(cell);
  if (i != -1) game.cells.splice(i, 1);
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
