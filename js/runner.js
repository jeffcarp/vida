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
var _baseID = 0;

// TEST
// The slowest function by far is cellExists(),
// because it does an O(n) traversal at least once
// per tick. Testing to see if I can speed it up by
// using an adjacency list.
var adjacency = {};

_addAdj = function(cell) {
  if (isNaN(cell.x) || isNaN(cell.y)) return;
  if (!(cell.x in adjacency)) adjacency[cell.x] = {};
  if (!(cell.y in adjacency[cell.x])) {
    adjacency[cell.x][cell.y] = cell;
  }
};

_removeAdj = function(x, y) {
  var cell = _atAdj(x, y);
  if (cell) delete adjacency[x][y];
};

_atAdj = function(x, y) {
  if (x in adjacency && y in adjacency[x]) return adjacency[x][y];
  else return null;
};

runner.init = function(userConfig) {
  config = runner.defaultConfig(userConfig);

  //runner.generateCells();
  //runner.introduce();

  // Hack to wait for DOM to load
  window.setTimeout(function() {
    render.setVars(game, config);
    render.init(config);
  }, 75);

  //runner.start();
};

runner.toggleStartStop = function() {
  _interval ? runner.stop() : runner.start();
};

runner.start = function() {
  runner.emit("game start");
  _interval = window.setInterval(function() {
    runner.tickAllCells();
  }, config.speed);
};

runner.stop = function() {
  runner.emit("game stop");
  _interval = window.clearInterval(_interval);
};

// Returns a clean slate of cells
runner.generateCells = function() {
  var num = 20;
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
  var cell = {
    x: options.x,
    y: options.y,
    age: 0,
    id: _baseID,
    energy: !isNaN(options.energy) ? options.energy : 300,
    parent: !isNaN(options.parent) ? options.parent : 100,
    ai: options.ai,
    type: options.type || "cell",
    color: !isNaN(options.color) ? options.color+10 : 0 
  };
  game.cells.push(cell);
  _addAdj(cell);
  _baseID += 1;
  return cell;
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
runner.introduce = function(ai) {
  ai = ai || "protoai";
  var num = 20;
  var origin = 50;
  var xOff = aux.rand(origin) - origin/2;
  var yOff = aux.rand(origin) - origin/2;
  var parentID = null;
  for (var i=0; i<num; i++) {
    var newCell = runner.createCell({
      x: aux.rand(num*4)-num*2 + xOff, 
      y: aux.rand(num*4)-num*2 + yOff,
      ai: "protoai",
      parent: parentID
    });
    if (i === 0) parentID = newCell.id;
  }
};
runner.tickAllCells = function() {

/*
  if (game.time % 30 == 0) {
    runner.introduce();
  }
*/

  game.time += 1;

  // For each cell
  game.cells.forEach(function(cell) {

    // See if there are any messages
    cell.age += 1;
    cell.energy -= 1; // Living takes energy, man

    // Cells die by running out of energy 
    if (cell.energy <= 0) {
      return runner.removeCell(cell);
    }

    // Cells die of overcrowding
// Note: we were calculating atari incorrectly, causing a lot of cells to die
/*
    var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    var atari = dirs.some(function(d) {
      return runner.vacant(cell.x+d[0], cell.y+d[1]);
    });
    if (!atari) {
      runner.removeCell(cell);
    }
*/

    var neighborhood = runner.neighborhoodFor(cell, 40);
    var messages = []; // TODO: Pass in messages
    var move = ais[cell.ai].tick(cell, neighborhood, messages, game.time);

    var passE = ais[cell.ai].passEnergy;

    if (typeof move == "object" && "type" in move && move.type === "eat") {
      var target = runner.cellAt(move.x, move.y);
      var dist = Math.abs(move.x - cell.x) + Math.abs(move.y - cell.y);
      if (target && dist < 3) {
        cell.energy += target.energy;
        return runner.removeCell(target)
        // I guess that could be it?
      }
    }
    else if (move[0] === 2 && move[1] === 2 && cell.energy > passE) {
      // Cell wants to reproduce
      if (runner.vacant(cell.x+1, cell.y)) {

        // TODO: Introduce genetic mutation here
        // TODO: Make reproduction take a lot of x-resources-- energy 
        runner.createCell({
          x: cell.x+1, 
          y: cell.y,
          energy: passE,
          ai: cell.ai,
          type: cell.type,
          color: cell.color,
          parent: cell.id
        });

        cell.energy -= passE;
      
      }
    }
    else {

      if (!runner.validMove(move)) return;

      var desiredX = cell.x + move[0];
      var desiredY = cell.y + move[1];

      // TODO: If valid
      if (!runner.cellExists(desiredX, desiredY)) {
        runner.move(cell, desiredX, desiredY);
        cell.energy -= 1; // Costs 1 energy
      }
    }
    
  });

  render.setVars(game, config);

  runner.emit("end tick", {
    population: game.cells.length,
    totalEnergy: runner.totalEnergy(game.cells)
  });
};

runner.totalEnergy = function(cells) {
  return cells.reduce(function(acc, cur) {
    return acc + (cur.energy || 0);
  }, 0);
};

runner.neighborhoodFor = function(cell, size) {
  var radius = size/2,
      startX = cell.x - radius,
      startY = cell.y - radius,
      endX = cell.x + radius,
      endY = cell.y + radius,
      neighborhood = {};
  for (var i=startX; i<endX; i++) {
    for (var j=startY; j<endY; j++) {
      var p = _atAdj(i, j);
      if (p) {
        if (!(i in neighborhood)) neighborhood[i] = {};
        neighborhood[i][j] = p;
      }
    }
  }
  return neighborhood;
};

runner.population = function() {
  return game.cells.length;
};

var _callbacks = {};
runner.emit = function(action, data) {
  if (action in _callbacks) {
    _callbacks[action].forEach(function(callback) {
      callback.call(null, data);
    });
  } 
};
runner.on = function(action, callback) {
  if (action in _callbacks) {
    _callbacks[action].push(callback);
  }
  else {
    _callbacks[action] = [callback];
  }
};

runner.move = function(cell, x, y) {
  _removeAdj(cell.x, cell.y);
  _addAdj(cell);
  cell.x = x;
  cell.y = y;
};

runner.removeCell = function(cell) {
  _removeAdj(cell.x, cell.y);
  var i = game.cells.indexOf(cell);
  if (i != -1) game.cells.splice(i, 1);
};

runner.cellExists = function(x, y) {
  return !!_atAdj(x, y);
};

runner.cellAt = function(x, y) {
  return _atAdj(x, y);
};

runner.vacant = function(x, y) {
  // TODO: Add outOfBounds()
  return !runner.cellExists(x, y); 
};

runner.validMove = function(move) {
  return (
    move
    && move.length == 2
    && (Math.abs(move[0]) <= 1)
    && (Math.abs(move[1]) <= 1)
    && (move[0] === 0 || move[1] === 0)
  );
};

module.exports = runner;
