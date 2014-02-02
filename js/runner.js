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
