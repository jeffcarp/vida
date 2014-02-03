(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var cellutil = {};

var aux = require("./helpers");

cellutil.randDir = function() {
  var move = [0, 0];
  var i = aux.rand(2)-1;
  move[i] = aux.rand(3)-1; 
  return move;
};

module.exports = cellutil;

},{"./helpers":2}],2:[function(require,module,exports){
var aux = {};

aux.rand = function(num) {
  return Math.floor(Math.random()*num);
};

module.exports = aux;

},{}],3:[function(require,module,exports){


var mapSize = document.getElementById("grid").width;
var blockSize = 4;

// Game params
var config = {
  mapSize: mapSize/blockSize, 
  blockSize: blockSize,
  speed: 2e3, 
};

var runner = (require("./runner")).init(config);



},{"./runner":6}],4:[function(require,module,exports){
var protoai = {};

var cellutil = require("./cellutil");

protoai.tick = function(cell, neighborhood, messages, time) {
  if (time % 2 == 0) {
    return [0, 1];
  }
  else {
    return cellutil.randDir();
  }
};

module.exports = protoai;

},{"./cellutil":1}],5:[function(require,module,exports){
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


render.init = function(config) {

  setup = true;

  var gridID = "grid";
  var blockSize = config.blockSize;
  canvas = document.getElementById(gridID);
  render.offsetX = render.offsetY = config.mapSize/2;

  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
  }
  else {
    alert("Please switch to a browser that supports canvas.");
  }

  var enteredX = null;
  var enteredY = null;
  var ofsX = null;
  var ofsY = null;

  canvas.addEventListener("mousedown", function(e) { 
    console.log("mousedown");
    enteredX = e.x - canvas.offsetLeft;
    enteredY = e.y - canvas.offsetTop;
    ofsX = render.offsetX;
    ofsY = render.offsetY;
  });


  canvas.addEventListener("mouseup", function(e) {
    console.log("mouseup");
    enteredX = null;
    enteredY = null;
    ofsX = null;
    ofsY = null;
  });

  canvas.addEventListener("mouseout", function(e) {
    console.log("mouseout");
    enteredX = null;
    enteredY = null;
    ofsX = null;
    ofsY = null;
  });

  canvas.addEventListener("mousemove", function(e) {
    if (!enteredX || !enteredY) return; 

    var ex = e.x - canvas.offsetLeft;
    var ey = e.y - canvas.offsetTop;
    console.log("ex, ey", ex, ey);
    console.log("entered", enteredX, enteredY);

    render.offsetX = (ex - enteredX) + ofsX;
    render.offsetY = (ey - enteredY) + ofsY;
    console.log("offsets", render.offsetX, render.offsetY);
    //render.draw();
  });

  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
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

render.cachedCells;
render.cachedTunnels;
render.cachedBases;
render.cachedBlockSize;

render.setVars = function(game, config) {
  game = game || {};
  config = config || {};

  var cells = game.cells || render.cachedCells || [];
  var tunnels = game.tunnels || render.cachedTunnels || [];
  var bases = game.bases || render.cachedBases || [];
  var blockSize = config.blockSize || render.cachedBlockSize || 2;

  render.cachedCells = cells;
  render.cachedTunnels = tunnels;
  render.cachedBases = bases;
  render.cachedBlockSize = blockSize;
};

// Takes a game state from runner.js and draws that on a canvas 
render.draw = function(game, config) {

  if (!setup) render.init(config);

  game = game || {};
  config = config || {};

  var cells = game.cells || render.cachedCells || [];
  var tunnels = game.tunnels || render.cachedTunnels || [];
  var bases = game.bases || render.cachedBases || [];
  var blockSize = config.blockSize || render.cachedBlockSize || 2;

  render.cachedCells = cells;
  render.cachedTunnels = tunnels;
  render.cachedBases = bases;
  render.cachedBlockSize = blockSize;

  // Clear grid
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bases.forEach(function(base) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(
      (base.x*blockSize)+render.offsetX, 
      (base.y*blockSize)+render.offsetY, 
      blockSize, 
      blockSize);
  });

  tunnels.forEach(function(tunnel) {
    ctx.fillStyle = "#111";
    ctx.fillRect(
      (tunnel.x*blockSize)+render.offsetX, 
      (tunnel.y*blockSize)+render.offsetY, 
      blockSize, 
      blockSize);
  });

  cells.forEach(function(cell) {
    ctx.fillStyle = "blue";//cell.color == "black" ? "black" : "maroon";

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

},{}],6:[function(require,module,exports){
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

},{"./protoai":4,"./render":5}]},{},[3])