// Vida Runner
var runner = {};

// Dependencies
var render = require("./render");
var aux = require("./helpers");
var cellutil = require("./cells/util");

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

runner.init = function(userConfig) {
  config = runner.defaultConfig(userConfig);

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

runner.createCell = function(options) {
  if (isNaN(options.x)) return; 
  if (isNaN(options.y)) return; 
  if (!(options.ai in ais)) return;

  var lineage = options.lineage || [];

  if (isNaN(options.color)) {
    var color = aux.rand(256);
  }
  else {
    var color = options.color;
  }

  var cell = {
    x: options.x,
    y: options.y,
    age: 0,
    id: _baseID,
    energy: !isNaN(options.energy) ? options.energy : 100,
    lineage: lineage,
    ai: options.ai,
    type: options.type || "cell",
    color: color
  };
  game.cells.push(cell);
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
runner.introduce = function(specialAI, num) {
  specialAI = specialAI || "protoai";
  num = num || 30;
  var space = 20;
  var origin = 50;
  var xOff = aux.rand(origin) - origin/2;
  var yOff = aux.rand(origin) - origin/2;
  var line = [];
  var color;
  for (var i=0; i<num; i++) {
    var proto = {
      x: aux.rand(space*4)-space*2 + xOff, 
      y: aux.rand(space*4)-space*2 + yOff,
      ai: specialAI,
      lineage: line
    };
    if (color) proto.color = color; 
    var newCell = runner.createCell(proto);
    if (i === 0) {
      line = [newCell.id];
      color = newCell.color;
    }
  }
};

var shuffleArray = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

var cellsOfAi = function(ai) {
  return game.cells.filter(function(c) {
    return c && c.ai === ai;
  });
};

runner.tickAllCells = function() {

  // EXPR: Keep the food supply constant
/*
  var constNum = 100;
  var foodLen = cellsOfAi("food").length;
  if (foodLen < constNum) {
    runner.introduce("food", constNum - foodLen);
  }
*/
  

  // Randomize order of array to make eating fair
  game.cells = shuffleArray(game.cells);
  // - I actually don't think this is necessary

  game.time += 1;

  var tickTimes = []; 

  // For each cell
  for (var cellIndex in game.cells) {
    var startTime = new Date();
    var cell = game.cells[cellIndex];

    // TODO: See if there are any messages
    cell.age += 1;
    if (cell.ai === "food") {
      if (game.time % 5 == 0) {
        cell.energy += 1; // EXPERIMENTAL photosynthesis
      }
    }
    else {
      cell.energy -= 1;
    }

    // Cells die by running out of energy 
    if (cell.energy <= 0) {
      game.cells = runner.removeCell(cell);
      continue; 
    }

    var neighborhood = runner.neighborhoodFor(cell, 100, game.cells);
    var messages = []; // TODO: Pass in messages
    var move = ais[cell.ai].tick(cell, neighborhood, messages, game.time);

    var passE = ais[cell.ai].passEnergy;

    if ("type" in move && move.type === "eat") {
      var target = move.target;
      if (target) {
        var dist = Math.abs(target.x - cell.x) + Math.abs(target.y - cell.y);
        if (dist < 5) {
          cell.energy += target.energy;
          game.cells = runner.removeCell(target);
          continue;
        }
      }
    }
    else if (move[0] === 2 && move[1] === 2 && cell.energy > passE) {
      // Cell wants to reproduce
      if (runner.vacant(cell.x+1, cell.y)) {

        var dir = cellutil.randDir();

        // TODO: Introduce genetic mutation here
        // TODO: Make reproduction take a lot of x-resources-- energy 
        var newLineage = cell.lineage.slice();
        newLineage.push(cell.id);
        runner.createCell({
          x: cell.x+dir[0], 
          y: cell.y+dir[1],
          energy: passE,
          ai: cell.ai,
          type: cell.type,
          lineage: newLineage,
          color: cell.color 
        });

        cell.energy -= passE;
      
      }
    }
    else {

      if (!runner.validMove(move)) continue; 

      var desiredX = cell.x + move[0];
      var desiredY = cell.y + move[1];

      // TODO: If valid
      if (!runner.cellExists(desiredX, desiredY)) {
        runner.move(cell, desiredX, desiredY);
        cell.energy -= 1; // Costs 1 energy
      }
    }
    
    var endTime = new Date();
    tickTimes.push(endTime - startTime);
  };

  // Compute averate tick time
  var totalTime = tickTimes.reduce(function(acc, cur) {
    return acc + cur;
  }, 0); 
  var averageTime = totalTime / (game.cells.length || 1); 
  var times = {
    average: averageTime,
    total: totalTime
  };

  var capacity = (config.speed * 0.95);
  if (totalTime > capacity) {
    runner.stop();
    var msg = "totalTime exceeded 95% capacity ("+capacity+")";
    alert(msg);
    throw new Error(msg);
  }

  render.setVars(game, config);

  runner.emit("end tick", {
    population: game.cells.length,
    totalEnergy: runner.totalEnergy(game.cells),
    averageAge: runner.averageAge(game.cells),
    times: times 
  });
};

runner.totalEnergy = function(cells) {
  return cells.reduce(function(acc, cur) {
    return acc + (cur.energy || 0);
  }, 0);
};

runner.averageAge = function(cells) {
  var totalAge = cells.reduce(function(acc, cur) {
    return acc + (cur.age || 0);
  }, 0);
  return totalAge / cells.length;
};

runner.neighborhoodFor = function(cell, size, cells) {
  var radius = size/2;
  var startX = cell.x - radius;
  var startY = cell.y - radius;
  var endX = cell.x + radius;
  var endY = cell.y + radius;
  var neighborhood = {};
  cells.forEach(function(c) {
    if (c.x >= startX && c.x <= endX
     && c.y >= startY && c.y <= endY) {
      if (!(c.x in neighborhood)) neighborhood[c.x] = {};
      neighborhood[c.x][c.y] = c;
    }
  });
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
  cell.x = x;
  cell.y = y;
};

runner.removeCell = function(cell) {
  var i = game.cells.indexOf(cell);
  if (i != -1) game.cells.splice(i, 1);
  return game.cells;
};

runner.cellExists = function(x, y) {
  return Boolean(runner.cellAt(x, y));
};

runner.cellAt = function(x, y) {
  return game.cells.reduce(function(acc, cur) {
    return (cur.x === x && cur.y === y) ? cur : acc; 
  }, null);
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
