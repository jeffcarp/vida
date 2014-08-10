var Bus = module.exports = function() {
};

var events = {};

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
