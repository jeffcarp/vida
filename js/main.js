var grid = document.getElementById('grid');
require('autoscale-canvas')(grid);

var mapSize = grid.width;
var blockSize = 4;

// Game params
var config = {
  mapSize: mapSize/blockSize,
  blockSize: blockSize,
  speed: 200
};

var runner = (require("./runner")).init(config);
require("./controls");
