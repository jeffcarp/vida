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
var _interval;

// TEST
// The slowest function by far is cellExists(),
// because it does an O(n) traversal at least once
// per tick. Testing to see if I can speed it up by
// using an adjacency list.
var adjacency = {};

_addAdj = function(x, y) {
  if (!(x in adjacency)) adjacency[x] = [];
  if (adjacency[x].indexOf(y) < 0) {
    adjacency[x].push(y);
  }
};

_removeAdj = function(x, y) {
  if (x in adjacency && adjacency[x].length) {
    var i = adjacency[x].indexOf(y);
    if (i != -1) adjacency[x].splice(i, 1);
  }
};

_existsAdj = function(x, y) {
  return x in adjacency && adjacency[x].indexOf(y) != -1;
};


runner.init = function(userConfig) {
  config = runner.defaultConfig(userConfig);

  runner.generateCells();

  // Hack to wait for DOM to load
  window.setTimeout(function() {
    render.setVars(game, config);
    render.init(config);
  }, 75);

  runner.start();
};

runner.toggleStartStop = function() {
  _interval ? runner.stop() : runner.start();
};

runner.start = function() {
  _interval = window.setInterval(function() {
    runner.tickAllCells();
  }, config.speed);
};

runner.stop = function() {
  _interval = window.clearInterval(_interval);
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
    color: !isNaN(options.color) ? options.color+10 : 0 
  });
  _addAdj(options.x, options.y);
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


// Right now this introduces a bunch of randos
// around a random spawn near the origin
runner.introduce = function() {
  var num = 20;
  var origin = 500;
  var xOff = aux.rand(origin) - origin/2;
  var yOff = aux.rand(origin) - origin/2;
  for (var i=0; i<num; i++) {
    runner.createCell({
      x: aux.rand(num*4)-num*2 + xOff, 
      y: aux.rand(num*4)-num*2 + yOff,
      ai: "protoai"
    });
  }
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
    if (move[0] === 2 && move[1] === 2 && game.cells.length < 1000) { 
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
        runner.move(cell, desiredX, desiredY);
      }
    }
    
  });

  render.setVars(game, config);

};

runner.move = function(cell, x, y) {
  _removeAdj(cell.x, cell.y);
  _addAdj(x, y);
  cell.x = x;
  cell.y = y;
};

runner.removeCell = function(cell) {
  _removeAdj(cell.x, cell.y);
  var i = game.cells.indexOf(cell);
  if (i != -1) game.cells.splice(i, 1);
};

runner.cellExists = function(x, y) {
  return _existsAdj(x, y);
  /*
  return game.cells.some(function(c) {
    return c.x == x && c.y == y;
  });
  */
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
