var grid = document.getElementById('grid');
// not working for some reason
//require('autoscale-canvas')(grid);

var bus = require('./bus');
var Renderer = require('./renderer');
var Game = require('./game');

var gameParams = {
  speed: 2e3
};

var renderer = new Renderer(grid);
var game = new Game();

renderer.draw();

//var runner = (require("./runner")).init(config);
require("./controls");
