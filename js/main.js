var mapSize = document.getElementById("grid").width;
var blockSize = 4;

// Game params
var config = {
  mapSize: mapSize/blockSize, 
  blockSize: blockSize,
  speed: 400 
};

var runner = (require("./runner")).init(config);

window.React = require("./react");

require("./controls.jsx");
