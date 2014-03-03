var map = {};

var _map = {};

map.add = function(cell) {
  if (!cell) throw new Error("map.add requires a cell");
  if (isNaN(cell.x)) throw new Error("map.add requires cell.x");
  if (isNaN(cell.y)) throw new Error("map.add requires cell.y");

  var x = cell.x;
  var y = cell.y;

  _map[x] = _map[x] || {}; 
  _map[x][y] = cell; 
};

map.exists = function(x, y) {
  return (
    _map[x] &&
    _map[x][y] &&
    _map[x][y] instanceof Object
  );
};

map.at = function(x, y) {
  return map.exists(x, y) ? _map(x, y) : null;
};

map.remove = function(x, y) {
  if (!_map[x]) return;
  if (!_map[x][y]) return;
  delete _map[x][y];
};

map.move = function(fromX, fromY, toX, toY) {
  var fromCell = map.at(fromX, fromY);
  if (!fromCell) return;

  map.remove(fromX, fromY);

  fromCell.x = toX;
  fromCell.y = toY;

  // Not currently checking for overrwriting
  // (although the caller of this function is)
  map.add(fromCell);
};

map.neighborhood = function(cell, size) {
  return _map;
/*
  var radius = size/2;
  var startX = cell.x - radius;
  var startY = cell.y - radius;
  var endX = cell.x + radius;
  var endY = cell.y + radius;
  var hood = {};
  for (var x=startX; x<=endX; x++) {
    if (x in _map) {
      hood[x] = {};
      for (var y=startY; y<=endY; y++) {
        hood[x][y] = _map[x][y];
      }
    }
  }
  return hood;
*/
};

module.exports = map;

