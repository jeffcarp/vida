var aiLibrary = require('./cells/library');
var aux = require('./helpers');

var Game = module.exports = function(options) {

  if (!options.map) throw Error('no map');

  this.bus = options.bus;
  this.map = options.map;
  this.speed = options.initialSpeed || 2e3;

  this.running = false;
  this.age = 0;

  if (this.bus) {
    this.bus.on('request game start', this.toggle.bind(this));
  }

  // TRYING OUT
  for (var i=0; i<20; i++) {
    var ai = i % 2 === 0 ? 'rando' : 'tiger';
    var res = this.map.place({
      x: aux.randOrigin(40),
      y: aux.randOrigin(40),
      hue: aux.rand(256),
      id: i,
      ai: ai
    });
  }
};

var gameData = {};
var interval = null;

Game.prototype.toggle = function() {
  this.running ? this.stop() : this.start();
};

Game.prototype.start = function() {
  var fn = this.tickAllCells.bind(this);
  interval = setInterval(fn, this.speed);
  this.running = true;
  this.bus && this.bus.emit('game start');
};

Game.prototype.stop = function() {
  clearInterval(interval);
  this.running = false;
  this.bus && this.bus.emit('game stop');
};

Game.prototype.tickAllCells = function() {

  var startTime = new Date();

  this.map.activeCells().forEach(function(cell) {
    var move = aiLibrary[cell.ai].tick();
    var x = cell.x;
    var y = cell.y;
    var res = this.map.move([x, y], [x + move.x, y + move.y]);
  }.bind(this));

  var endTime = new Date();
  var totalTime = endTime - startTime;

  this.bus.emit('end tick', {
    population: this.map.activeCells().length,
    totalEnergy: 2,
    averageAge: 2,
    age: this.age,
    totalTime: totalTime,
    cells: this.map.activeCells()
  });

  this.age += 1;
};
