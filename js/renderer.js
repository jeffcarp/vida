var bus = require('./bus');

var Renderer = module.exports = function(canvasElem, bus) {
  this.bus = bus;
  this.canvas = canvasElem;
  this.context = canvasElem.getContext('2d');
  this.originX = 500;
  this.originY = 200;
  this.cells = [];

  this.bus.on('end tick', function(data) {
    this.cells = data.cells
    window.requestAnimFrame(this.draw.bind(this));
  }.bind(this));
};

Renderer.prototype.markOrigin = function() {

  var x = this.originX;
  var y = this.originY;
  var radius = 4;

  this.context.beginPath();
  this.context.strokeStyle = "hsl(100, 50%, 50%)";
  this.context.lineWidth = 2;
  this.context.arc(x, y, radius, 0, 2*Math.PI);
  this.context.stroke();
};

Renderer.prototype.getGameData = function() {
};

Renderer.prototype.draw = function() {

  // Clear canvas
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.markOrigin();

  this.cells.forEach(function(cell) {
    var hue = cell.hue || 250;
    this.context.fillStyle = "hsl("+hue+", 50%, "+50+"%)";

    var x = cell.x + this.originX;
    var y = cell.y + this.originY;
    var blockSize = 10;

    this.context.fillRect(x, y, blockSize, blockSize);
  }.bind(this));
};
