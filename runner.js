
var map;
var ships = [];

var redPrototype = "Red Mark 2";
var blackPrototype = "Vice Mark 2";


document.getElementById('redShip').innerText = redPrototype;
document.getElementById('blackShip').innerText = blackPrototype;

// map[y][x]

var setup = function() {
  ships = [];
  map = aux.createMap(mapSize);
  assignRandomStartingPositions(map, ships);
  renderMap(map, ships);
};

var assignRandomStartingPositions = function(map, ships) {
  var halfGrid = mapSize/2; 
  var x, y, space;
  for (var i=0; i<starting; i++) {
    var redShip = new shipModels[redPrototype]('red', i); 
    occupy(map, redShip, aux.rand(halfGrid), aux.rand(mapSize));
    if (redShip.x && redShip.y) ships.push(redShip);
    var blackShip = new shipModels[blackPrototype]('black', i); 
    occupy(map, blackShip, halfGrid+aux.rand(halfGrid), aux.rand(mapSize));
    if (blackShip.x && blackShip.y) ships.push(blackShip);
  }
};

/*
 * MAP INTERACTION
 * =============================== */

var at = function(map, x, y) {
  if (map && map[y] && map[y][x]) {
    return map[y][x];
  } else {
    return null;
  }
};

var occupied = function(map, x, y) {
  var space = at(map, x, y);
  return space && space.ship != null;
};

var occupy = function(map, ship, x, y) {
  var space = at(map, x, y);
  if (!occupied(map, x, y) && space) {
    space.ship = ship;
    ship.x = x;
    ship.y = y;
  }
};

var move = function(map, ship, dir) {
  var newX = ship.x+dir[0];
  var newY = ship.y+dir[1];
  // Go back if ship already there
  if (occupied(map, newX, newY)) return;
  // Remove ship in current space
  var space = at(map, ship.x, ship.y);
  var newSpace = at(map, newX, newY);
  if (space && newSpace) { 
    space.ship = null;
    // Occupy next
    occupy(map, ship, newX, newY);
  }
};

var destroyShip = function(ships, ship) {
  var space = at(map, ship.x, ship.y);
  if (space) {
    space.ship = null;
    var i = ships.indexOf(ship);
    ships.splice(i, 1);
  }
};

/*
 * GAME RUNNING 
 * =============================== */

var gameRunning = false; 
var turn = 0;
var iterationRunning = false; 

var begin = function() {
  if (gameRunning) return;
  gameRunning = true;
  iterationRunning = false;
  var interval = setInterval(function() {
    if (!gameRunning) clearInterval(interval);
    if (!iterationRunning) {
      iterationRunning = true;
      iterate();
    }
  }, 100);
};

var pause = function() {
  gameRunning = false;
};

var iterate = function() {
  turn++;
  // Tick all ships
  for (var i=0; i<ships.length; i++) {
    var ship = ships[i];

    // See if anyone has won the game 
    if (numberOf('black', ships) < 4) {
      console.log('red wins!');
      gameRunning = false;
      return;
    } else if (numberOf('red', ships) < 4) {
      console.log('black wins!');
      gameRunning = false;
      return;
    }

    // If this ship has no liberties, destroy it
    var left  = at(map, ship.x-1, ship.y);
    var right = at(map, ship.x+1, ship.y);
    var up    = at(map, ship.x, ship.y-1);
    var down  = at(map, ship.x, ship.y+1);
    if ((!left  || left.ship != null)
     && (!right || right.ship != null)
     && (!up    || up.ship != null)
     && (!down  || down.ship != null)) {
      console.log(ship.color+' '+ship.text+' down');
      destroyShip(ships, ship);
    }

    var dir = ship.tick(map, turn, ships);
    if (dir && dir.length == 2) {
      move(map, ship, dir);
    } 
  } 

  document.getElementById('numBlack').innerText = numberOf('black', ships);
  document.getElementById('numRed').innerText = numberOf('red', ships);
  document.getElementById('turn').innerText = turn;

  renderMap(map, ships);
  iterationRunning = false; 
};

/*
 * SHIP FETCHING 
 * =============================== */

var numberOf = function(color, ships) {
  return ships.filter(function(s) {
    if (s.color == color) return s;
  }).length; 
};

/*
 * DOM MANIPULATION
 * =============================== */

var clearMap = function(map) {
  var blocks = document.getElementsByClassName('block');
  for (var i=0; i<blocks.length; i++) {
    var b = blocks[i];
    b.removeAttribute('data-color');
  }
};

var renderMap = function(map, ships) {
  clearMap();
  for (var i=0; i<ships.length; i++) {
    var ship = ships[i];
    var elem = blockAt(ship.x, ship.y);
    if (elem) {
      elem.innerText = ship.text;
      elem.setAttribute('data-color', ship.color);
    }
  }
};

var blockAt = function(x, y) {
  var blocks = document.getElementsByClassName('block');
  for (var i in blocks) {
    var b = blocks[i];
    if (b.getAttribute('data-x') == x && b.getAttribute('data-y') == y) {
      return b;
    } 
  }
}; 

// BEGIN
setup();
