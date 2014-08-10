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

  var cell = {
    x: 50,
    y: -10,
    id: 1,
    hue: 200
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

  this.map.activeCells().forEach(function(cell) {
    var x = cell.x;
    var y = cell.y;
    this.map.move([x, y], [x, y+1]);
  }.bind(this));

  this.bus.emit('end tick', {
    population: 2,
    totalEnergy: 2,
    averageAge: 2,
    times: {
      total: 2
    },
    cells: this.map.activeCells()
  });

  this.age += 1;
};
