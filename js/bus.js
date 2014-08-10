var Bus = module.exports = function() {
};

var events = {};

Bus.prototype.cellBuffer = [
  {x: 10, y: 20, hue: 200},
  {x: 40, y: 50, hue: 100},
  {x: -60, y: 10, hue: 50},
  {x: 30, y: -70, hue: 175}
];

Bus.prototype.on = function(key, fn) {
  events[key] = events[key] || [];
  events[key].push(fn);
};

Bus.prototype.emit = function(key, data) {
  var fns = events[key] || [];
  fns.forEach(function(fn) {
    fn.call(null, data);
  });
};

Bus.prototype.getEvents = function(key) {
  if (key) {
    return events[key];
  }
  else {
    return events;
  }
};
