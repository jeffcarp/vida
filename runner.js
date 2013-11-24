
// Game params
var mapSize = 200;
var startingNum = mapSize/2;
var blockSize = 1; 
var rotationSpeed = 50;
var maxTurn = mapSize*mapSize;

var redPrototype = "Speeder 1";
var blackPrototype = "Speeder 1";

// Data 
var ships = [];

aux.write('redShip', redPrototype);
aux.write('blackShip', blackPrototype);

var setup = function() {
  generateShips(mapSize, ships);
  renderShips(ships);
};

var generateShips = function(mapSize) {
  var halfGrid = mapSize/2; 
  var ship;
  for (var i=0; i<mapSize; i++) {
    var color = (i % 2) ? 'red' : 'black';
    var proto = (i % 2) ? redPrototype : blackPrototype;
    ship = new shipModels[proto](color, Math.floor(i/2));
    ship.x = (i % 2) ? aux.rand(halfGrid) : halfGrid+aux.rand(halfGrid);
    ship.y = (i % 2) ? aux.rand(mapSize) : aux.rand(mapSize);
    if (!occupied(ship, ship.x, ship.y)) ships.push(ship);
  }
};

/*
 * NAVIGATION TOOLS 
 * =============================== */

var occupied = function(ships, x, y) {
  for (var i=0; i<ships.length; i++) {
    var ship = ships[i];
    if (ship.x === x && ship.y === y) {
      return true; 
    }
  }
  return false; 
};

var liberty = function(ships, x, y) {
  return (!occupied(ships, x, y)
       && x >= 0
       && y >= 0
       && x < mapSize
       && y < mapSize);
};

var move = function(ships, ship, dir) {
  var newX = ship.x+dir[0];
  var newY = ship.y+dir[1];
  if (liberty(ships, newX, newY)) {
    ship.x = newX;
    ship.y = newY;
  };
};

var destroyShip = function(ships, ship) {
  console.log(ship.color+' '+ship.text+' down');
  var i = ships.indexOf(ship);
  ships.splice(i, 1);
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
  }, rotationSpeed);
};

var pause = function() {
  gameRunning = false;
};

var iterate = function() {
  turn++;

  // If time has run out
  if (turn > maxTurn) {
    var numBlack = numberOf('black', ships);
    var numRed = numberOf('red', ships);
    console.log('Max number of turns reached!');
    if (numBlack > numRed) {
      console.log('Black wins!');
    } else if (numRed > numBlack) {
      console.log('Red wins!');
    } else if (numRed == numBlack) {
      console.log("It's a draw!");
    }
    gameRunning = false;
    return;
  }

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
    // TODO: Add this back

    var left = liberty(ships, ship.x-1, ship.y);
    var right = liberty(ships, ship.x+1, ship.y);
    var up = liberty(ships, ship.x, ship.y-1);
    var down = liberty(ships, ship.x, ship.y+1);
    if (!left && !right && !up && !down) {
      console.log(ship);
      destroyShip(ships, ship);
    }

    var dir = ship.tick(turn, ships);
    if (dir && dir.length == 2) {
      move(ships, ship, dir);
    } 
  } 

  aux.write('numBlack', numberOf('black', ships));
  aux.write('numRed', numberOf('red', ships));
  aux.write('turn', turn);

  renderShips(ships);
  iterationRunning = false; 
};

/*
 * SHIP OPERATIONS 
 * =============================== */

var numberOf = function(color, ships) {
  return ships.filter(function(s) {
    if (s.color == color) return s;
  }).length; 
};

//var gridSize = 400;
//var gridOneSide = 100;
//var blockSize = gridSize / gridOneSide;

// Set up grid 
var grid = document.getElementById('grid');
var dimension = mapSize*blockSize;
grid.style.width = dimension+"px";
grid.style.height = dimension+"px";

// Takes a bunch of ships, packages them up, and
// passes them to the SVG/DOM
var renderShips = function(ships) {
/*
  var renderData = [];
  for (var i=0; i<ships.length; i++) {
    var ship = ships[i];
    renderData.push(ship);
  }
*/
  redrawGrid(ships);
};

var colorFor = function(chr) {
  if (chr == 'red') {
    return "maroon";
  } else if (chr == 'black') {
    return "black";
  }
};

var edge = mapSize*blockSize;
var svg = d3.select("#grid").append("svg")
  .attr("width", edge)
  .attr("height", edge);

var map;
var redrawGrid = function(data) {
  if (map) {
    svg.selectAll("rect")
        .data(data)
        //.transition()
        .attr("x", function(d) { return d.x*blockSize; })
        .attr("y", function(d) { return d.y*blockSize; });
  } else {
    map = svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) { return d.x*blockSize; })
        .attr("y", function(d) { return d.y*blockSize; })
        .attr("width", blockSize)
        .attr("height", blockSize)
        .text(function(d) { return d.text; })
        .style("fill", function(d) { return colorFor(d.color); });
  }
};

// Begin 
setup();

// Question: How do we keep tick order deterministic and fair?
