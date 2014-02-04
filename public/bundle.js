(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var food = {};

var cellutil = require("./util");
var aux = require("../helpers");

food.tick = function(cell, neighborhood, messages, time) {

  if (cell.age > 20 && aux.rand(18) === 1) {
    return [2, 2]; // Reproduce
  }

  return cellutil.randDir();
};

module.exports = food;

},{"../helpers":5,"./util":4}],2:[function(require,module,exports){
var protoai = {};

var cellutil = require("./util");
var aux = require("../helpers");

protoai.tick = function(cell, neighborhood, messages, time) {

  if (cell.age > 20 && aux.rand(18) === 1) {
    return [2, 2]; // Reproduce
  }

  return cellutil.randDir();
};

module.exports = protoai;

},{"../helpers":5,"./util":4}],3:[function(require,module,exports){
var protoai = {};

var cellutil = require("./util");

protoai.tick = function(cell, neighborhood, messages, time) {
  return cellutil.randDir();
};

module.exports = protoai;

},{"./util":4}],4:[function(require,module,exports){
var cellutil = {};

var aux = require("../helpers");

cellutil.randDir = function() {
  var move = [0, 0];
  var i = aux.rand(2);
  move[i] = aux.rand(3)-1; 
  return move;
};

module.exports = cellutil;

},{"../helpers":5}],5:[function(require,module,exports){
var aux = {};

aux.rand = function(num) {
  return Math.floor(Math.random()*num);
};

module.exports = aux;

},{}],6:[function(require,module,exports){


var mapSize = document.getElementById("grid").width;
var blockSize = 4;

// Game params
var config = {
  mapSize: mapSize/blockSize, 
  blockSize: blockSize,
  speed: 50 
};

var runner = (require("./runner")).init(config);



},{"./runner":8}],7:[function(require,module,exports){
/* 
# Vida Renderer

## Coordinate System
- Origin is the center (think cartesian plane, not GUI programming)

*/

var render = {};

var canvas;
var ctx;
var setup = false;
render.offsetX = 0;
render.offsetY = 0;
render.zoom = 1;

window.setZoom = function(zoom) {
  render.zoom = zoom;
  render.resetCanvasAspect();
};

render.init = function(config) {

  setup = true;

  var gridID = "grid";
  var blockSize = config.blockSize;
  canvas = document.getElementById(gridID);
  render.offsetX = render.offsetY = window.innerHeight/2;

  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
  }
  else {
    alert("Please switch to a browser that supports canvas.");
  }

  render.resetCanvasAspect();

      // Keep canvas's aspect ratio the same
  window.onresize = function(e) {
    render.resetCanvasAspect();
  };

  var enteredX = null;
  var enteredY = null;
  var ofsX = null;
  var ofsY = null;

  canvas.addEventListener("mousedown", function(e) { 
    enteredX = (e.x - canvas.offsetLeft) * render.zoom;
    enteredY = (e.y - canvas.offsetTop) * render.zoom;
    ofsX = render.offsetX;
    ofsY = render.offsetY;
  });


  canvas.addEventListener("mouseup", function(e) {
    enteredX = null;
    enteredY = null;
    ofsX = null;
    ofsY = null;
  });

  canvas.addEventListener("mouseout", function(e) {
    enteredX = null;
    enteredY = null;
    ofsX = null;
    ofsY = null;
  });

  canvas.addEventListener("mousemove", function(e) {
    if (!enteredX || !enteredY) return; 

    var ex = (e.x - canvas.offsetLeft) * render.zoom;
    var ey = (e.y - canvas.offsetTop) * render.zoom;

    render.offsetX = (ex - enteredX) + ofsX;
    render.offsetY = (ey - enteredY) + ofsY;
  });

  window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           function(callback) {
             window.setTimeout(callback, 1000 / 60);
           };
  })();


  // usage:
  // instead of setInterval(render, 16) ....

  (function animloop(){
    requestAnimFrame(animloop);
    render.draw();
  })();

};

render.resetCanvasAspect = function() {
  canvas.width = window.innerWidth*render.zoom;
  canvas.height = window.innerHeight*render.zoom;
};

render.cachedCells;
render.cachedBlockSize;

render.setVars = function(game, config) {
  game = game || {};
  config = config || {};

  var cells = game.cells || render.cachedCells || [];
  var blockSize = config.blockSize || render.cachedBlockSize || 2;

  render.cachedCells = cells;
  render.cachedBlockSize = blockSize;
};

// Takes a game state from runner.js and draws that on a canvas 
render.draw = function(game, config) {

  if (!setup) render.init(config);

  game = game || {};
  config = config || {};

  var cells = game.cells || render.cachedCells || [];
  var blockSize = config.blockSize || render.cachedBlockSize || 2;

  render.cachedCells = cells;
  render.cachedBlockSize = blockSize;

  // Clear grid
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  cells.forEach(function(cell) {
    if (cell.type === "food") {
      ctx.fillStyle = "green";
    }
    else {
      ctx.fillStyle = "hsl("+cell.color+", 50%, 40%)";
    }

    // Now instead of just going from the origin, we have to convert
    //   our cells' central origin coords to the canvas's top left coords
    // I feel like we just have to add half the canvas size
    ctx.fillRect(
      (cell.x*blockSize)+render.offsetX, 
      (cell.y*blockSize)+render.offsetY, 
      blockSize, 
      blockSize);
  });

};

module.exports = render;

},{}],8:[function(require,module,exports){
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

},{"./cells/food":1,"./cells/protoai":2,"./cells/rando":3,"./helpers":5,"./render":7}]},{},[6])