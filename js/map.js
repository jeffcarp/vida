var Map = module.exports = function(options) {
  // Check this instanceof?
  this.height = options.height;
  this.width = options.width;

  // Not sure if it's the greatest idea
  // to make these public facing
  this.graph = {};
  this.cells = {};
};

Map.prototype.at = function(x, y) {
  if (this.graph[x] !== undefined
      && this.graph[x][y] !== undefined) {
    // Graph only stores IDs
    return this.cells[this.graph[x][y]];
  }
  else {
    return null;
  }
};

Map.prototype.idAt = function(x, y) {
  return (this.graph[x] && this.graph[x][y]) || null;
};

Map.prototype.place = function(cell, x, y) {
  if (!x) {
    if (!cell.x) {
      return false;
    }
    else {
      var x = cell.x;
    }
  }
  if (!y) {
    if (!cell.y) {
      return false;
    }
    else {
      var y = cell.y;
    }
  }
  if (x > this.width || x < -this.width) {
    return false;
  }
  if (y > this.height || y < -this.height) {
    return false;
  }
  if (!isNaN(cell.id) && this.vacant(x, y)) {
    cell.x = x;
    cell.y = y;
    this.graph[x] = this.graph[x] || {};
    this.graph[x][y] = cell.id;
    this.cells[cell.id] = cell;
    return true;
  }
  else {
    return false;
  }
};

Map.prototype.vacant = function(x, y) {
  return !Boolean(this.at(x, y));
};

Map.prototype.removeById = function(id) {
  var cell = this.cells[id];
  if (!cell) return false;
  var x = cell.x;
  var y = cell.y;
  if (!this.vacant(x, y)) {
    delete this.graph[x][y];
    if (Object.keys(this.graph[x]).length === 0) {
      delete this.graph[x];
    }
    delete this.cells[id];
    return true;
  }
  else {
    return false;
  }
};

Map.prototype.move = function(from, to) {
  var fromX = from[0];
  var fromY = from[1];
  var toX = to[0];
  var toY = to[1];
  if (toX > this.width || toX < -this.width) {
    return 'X out of bounds';
  }
  if (toY > this.height || toY < -this.height) {
    return 'Y out of bounds';
  }
  if (this.vacant(fromX, fromY)) {
    return 'No cell at from coords';
  }
  if (!this.vacant(toX, toY)) {
    return 'To coords occupied';
  }
  var cell = this.at(fromX, fromY);
  this.removeById(cell.id);
  this.place(cell, toX, toY);
  return true;
};

Map.prototype.activeCells = function() {
  return Object.keys(this.cells).map(function(key) {
    return this.cells[key];
  }.bind(this));
};
