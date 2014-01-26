
//iindow.runner = window.runner || {};

// Game params
var mapSize = 100; 
var startingNum = mapSize/2;
var blockSize = 4; 
var rotationSpeed = 50;
var maxTurn = mapSize*mapSize;

var redPrototype = "Speeder 3";
var blackPrototype = "Speeder 3";

var tempNumberOfBlack = 0;
var tempNumberOfRed = 0;

// Data 
var ships = [];

aux.write('redShip', redPrototype);
aux.write('blackShip', blackPrototype);

var setup = function() {
  generateShips(mapSize, ships);
  redrawGrid(ships);
};

var generateShips = function(mapSize) {
  var halfGrid = mapSize/2,
      ship;
  for (var i=0; i<startingNum; i++) {
    var color = (i % 2) ? 'red' : 'black';
    var proto = (i % 2) ? redPrototype : blackPrototype;
    ship = new shipModels[proto](color, Math.floor(i/2));
    ship.x = (i % 2) ? aux.rand(halfGrid) : halfGrid+aux.rand(halfGrid);
    ship.y = (i % 2) ? aux.rand(mapSize) : aux.rand(mapSize);
    ship.uid = i;
    if (!occupied(ship, ship.x, ship.y)) {
      ships.push(ship);
    }
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
  if (Math.abs(dir[0]) > 1) return;
  if (Math.abs(dir[1]) > 1) return;
  var newX = ship.x+dir[0];
  var newY = ship.y+dir[1];
  if (liberty(ships, newX, newY)) {
    ship.x = newX;
    ship.y = newY;
  };
};

var destroyShip = function(ships, ship) {
  //aux.append('out', ship.color+' '+ship.text+' down');
  if (ship.color == "black") {
    tempNumberOfBlack -= 1;
  }
  else {
    tempNumberOfRed -= 1;
  }
  var i = ships.indexOf(ship);
  ships.splice(i, 1);
};

/*
 * GAME RUNNING 
 * =============================== */

var gameRunning = false; 
var turn = 0;
var iterationRunning = false; 
var prevPos = []; 
var interval;

var begin = function() {
  if (gameRunning) return;
  gameRunning = true;
  iterationRunning = false;
  interval = setInterval(function() {
    if (!gameRunning) clearInterval(interval);
    if (!iterationRunning) {
      iterationRunning = true;
      iterate();
    }
  }, rotationSpeed);
};

var pause = function() {
  if (interval) clearInterval(interval);
  gameRunning = false;
};

var advanceTurn = function() {
  turn++;
  if (turnCallback) turnCallback(turn);
};

var iterate = function() {
  advanceTurn();

  prevPos = ships.map(function(ship) {
    return [ship.x, ship.y, ship.color];
  });

  // If time has run out
  if (turn > maxTurn) {
    var numBlack = numberOf('black', ships);
    var numRed = numberOf('red', ships);
    aux.append('out', 'Max number of turns reached!');
    if (numBlack > numRed) {
      aux.append('out', 'Black wins!');
    } else if (numRed > numBlack) {
      aux.append('out', 'Red wins!');
    } else if (numRed == numBlack) {
      aux.append('out', "It's a draw!");
    }
    gameRunning = false;
    return;
  }

  // Tick all ships
  for (var i=0; i<ships.length; i++) {
    var ship = ships[i];

    // See if anyone has won the game 
    if (numberOf('black', ships) < 4) {
      aux.append('out', 'red wins!');
      gameRunning = false;
      return;
    } else if (numberOf('red', ships) < 4) {
      aux.append('out', 'black wins!');
      gameRunning = false;
      return;
    }

    // If this ship has no liberties, destroy it
    var left = liberty(ships, ship.x-1, ship.y);
    var right = liberty(ships, ship.x+1, ship.y);
    var up = liberty(ships, ship.x, ship.y-1);
    var down = liberty(ships, ship.x, ship.y+1);
    if (!left && !right && !up && !down) {
      destroyShip(ships, ship);
    }

    var dir = ship.tick(turn, ships);
    if (dir && dir.length == 2) {
      move(ships, ship, dir);
    } 
  } 

  var numBlack = numberOf('black', ships);
  var numRed = numberOf('red', ships);
  var numTotal = numBlack + numRed;
  aux.write('numBlack', numBlack);
  aux.write('numRed', numRed);
  aux.write('numTotal', numTotal);
  aux.write('turn', turn);
  var redPercent = numRed / numTotal * 100; 
  document.getElementById("red-percent").style.width = redPercent + "%";

  // Experimental!
  var redInfo = "";
  for (var i in ships) {
    var ship = ships[i];
    if (ship.color != 'red') continue;
    redInfo += "<p>";
    redInfo += "red "+ship.text;
//    redInfo += " (x "+ship.x+")";
 //   redInfo += " (y "+ship.y+")";
    if (ship.target) {
      redInfo += " (targ "+ship.target.color+" "+ship.target.text+")";
    }
    redInfo += "</p>";
  }
  aux.html('shipinfo', redInfo);

  var blackInfo = "";
  for (var i in ships) {
    var ship = ships[i];
    if (ship.color != 'black') continue;
    blackInfo += "<p>";
    blackInfo += "black "+ship.text;
    if (ship.target) {
      blackInfo += " (targ "+ship.target.color+" "+ship.target.text+")";
    }
    blackInfo += "</p>";
  }
  aux.html('blackinfo', blackInfo);

  redrawGrid(ships, prevPos);
  iterationRunning = false; 
};

/*
 * SHIP OPERATIONS 
 * =============================== */
var numberOf = function(color, ships) {

  if (color == "black" && tempNumberOfBlack !== 0) {
    return tempNumberOfBlack;
  }
  else if (color == "red" && tempNumberOfRed !== 0) {
    return tempNumberOfRed;
  }

  var number = ships.filter(function(s) {
    if (s.color == color) return s;
  }).length; 

  if (color == "black") {
    tempNumberOfBlack = number;
  }
  else if (color == "red") {
    tempNumberOfRed = number;
  }

  return number;
};

//var gridSize = 400;
//var gridOneSide = 100;
//var blockSize = gridSize / gridOneSide;

// Set up grid 
//var grid = document.getElementById('grid');
//var dimension = mapSize*blockSize;
//grid.style.width = dimension+"px";
//grid.style.height = dimension+"px";

// Takes a bunch of ships, packages them up, and
// passes them to the SVG/DOM

var colorFor = function(chr) {
  if (chr == 'red') {
    return "maroon";
  } else if (chr == 'black') {
    return "black";
  }
};

var edge = mapSize*blockSize;

// Begin 
setTimeout(function() {

  window.canvas = document.getElementById("grid");
  if (canvas.getContext) {
    window.ctx = canvas.getContext("2d");
  }
  else {
    alert("Please use a browser that supports canvas.");
  }

  var map;
  window.redrawGrid = function(cells, prevPos) {
    cells = cells || [];
    prevPos = prevPos || [];
    // This could be refactored to just paint cells a color or white
    if (prevPos.length) {
      prevPos.forEach(function(coord) {
        if (coord[2] == "black") {
          ctx.fillStyle = "rgb(230, 230, 230)";
        }
        else {
          ctx.fillStyle = "rgb(250, 230, 230)";
        }
        ctx.fillRect(coord[0]*blockSize, coord[1]*blockSize, blockSize, blockSize);
      });
    }
    else {
      // Clear grid
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    cells.forEach(function(cell) {
      ctx.fillStyle = cell.color == "black" ? "black" : "maroon";
      ctx.fillRect(cell.x*blockSize, cell.y*blockSize, blockSize, blockSize);
      //ctx.fillRect (cell.x, cell.y, 1, 1);
    });
  };

  setup();
}, 500);

