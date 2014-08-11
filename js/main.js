var grid = document.getElementById('grid');
require('./util/requestanimframe');

var Bus = require('./bus');
var Renderer = require('./renderer');
var Game = require('./game');
var Map = require('./map');

var bus = new Bus();

var map = new Map({
  width: 60,
  height: 60
});

var renderer = new Renderer(grid, bus);

var game = new Game({
  bus: bus,
  map: map,
  initialSpeed: 80
});

renderer.draw();

//var runner = (require("./runner")).init(config);
var controls = require("./controls");
controls(bus, 'controls');

game.start();
