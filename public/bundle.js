(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// Game params
var config = {
  mapSize: 100, 
  blockSize: 4, 
  speed: 50, 
};

var runner = (require("./runner")).init(config);



},{"./runner":3}],2:[function(require,module,exports){
// Vida Renderer
var render = {};

// Takes cells and outputs them to a canvas
render.draw = function(cells) {
};

module.exports = render;

},{}],3:[function(require,module,exports){
// Vida Runner
var runner = {};

// Dependencies
var render = require("./render");

var game = {
  cells: []
};
var config = {};

runner.init = function(userConfig) {

  config = runner.defaultConfig(userConfig);

  game.cells = runner.generateCells();
  render.draw(game.cells);

  console.log(config);
};

// Returns a clean slate of cells
runner.generateCells = function() {
};

runner.defaultConfig = function(userConfig) {
  var mapSize = userConfig.mapSize || 100;
  return ({
    mapSize: mapSize,
    startingNum: mapSize / 2,
    blockSize: userConfig.blockSize || 2,
    speed: userConfig.speed || 100,
    maxTurn: Math.pow(config.mapSize, 2)
  });
};

module.exports = runner;

},{"./render":2}]},{},[1])