var Game = module.exports = function(options) {

  if (!options.map) throw Error('no map');

  this.bus = options.bus;
  this.map = options.map;
  this.initialSpeed = options.initialSpeed || 200;

  this.running = false;
  this.age = 0;

  if (this.bus) {
    this.bus.on('request game start', this.toggle.bind(this));
  }
};

var gameData = {};

Game.prototype.toggle = function() {
  this.running ? this.stop() : this.start();
};

Game.prototype.start = function() {
  this.running = true;
  this.bus && this.bus.emit('game start');
};

Game.prototype.stop = function() {
  this.running = false;
  this.bus && this.bus.emit('game stop');
};

Game.prototype.getGameData = function() {
  return {
    running: this.running
  };
};
