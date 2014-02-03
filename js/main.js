

var mapSize = document.getElementById("grid").width;
var blockSize = 4;

// Game params
var config = {
  mapSize: mapSize/blockSize, 
  blockSize: blockSize,
  speed: 2e3, 
};

var runner = (require("./runner")).init(config);


