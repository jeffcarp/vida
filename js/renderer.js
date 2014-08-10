var bus = require('./bus');

var Renderer = module.exports = function(canvasElem) {
  this.canvas = canvasElem;
  this.context = canvasElem.getContext('2d');
};

Renderer.prototype.getGameData = function() {
};

Renderer.prototype.draw = function() {

  // Clear canvas
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.context.fillStyle = "hsl("+200+", 50%, "+50+"%)";

  var x = 500;
  var y = 100;
  var blockSize = 10;

  this.context.fillRect(x, y, blockSize, blockSize);
};
