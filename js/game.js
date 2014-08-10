var rando = require('./cells/rando');

var Game = module.exports = function(options) {

  if (!options.map) throw Error('no map');

  this.bus = options.bus;
  this.map = options.map;
  this.speed = options.initialSpeed || 2e3;

  this.ais = {
    'rando': rando
  };

  this.running = false;
  this.age = 0;

  if (this.bus) {
    this.bus.on('request game start', this.toggle.bind(this));
  }

  // TRY
  var cell = {
    x: 20,
    y: -5,
    id: 1,
    hue: 200
  };

  this.map.place(cell, cell.x, cell.y);
  var cell = {
    x: -10,
    y: 0,
    id: 2,
    hue: 100
  };

  this.map.place(cell, cell.x, cell.y);
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
    var move = this.ais['rando'].tick();
    var x = cell.x;
    var y = cell.y;
    this.map.move([x, y], [x + move.x, y + move.y]);
  }.bind(this));

  var endTime = new Date();
  var totalTime = endTime - startTime;

  this.bus.emit('end tick', {
    population: this.map.activeCells().length,
    totalEnergy: 2,
    averageAge: 2,
    totalTime: totalTime,
    cells: this.map.activeCells()
  });

  this.age += 1;
};
