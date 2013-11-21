var gridSize = 20;
var starting = 10;

//var map = aux.createMap(gridSize);

var grid = document.getElementById('grid');
for (var i=0; i<gridSize; i++) {
  for (var j=0; j<gridSize; j++) {
    var block = document.createElement('div');
    block.className = 'block';
    block.setAttribute('data-y', i);
    block.setAttribute('data-x', j);
    grid.appendChild(block); 
  }
} 

var setUpGrid = function(startingPositions) {
  
  var halfGrid = gridSize/2; 
  var x, y;
  for (var r=0; r<starting; r++) {
    occupy('red', aux.rand(halfGrid), aux.rand(gridSize));
  }

  for (var b=0; b<starting; b++) {
    occupy('black', halfGrid+aux.rand(halfGrid), aux.rand(gridSize));
  }
};

var occupy = function(color, x, y) {
  // Check if params are ok
  //console.log(color, x, y);
  if (color !== 'black' && color !== 'red') return;
  // Check if space is occupied
  //console.log(color, x, y);
  var space = spaceAt(x, y);
  if (space && space.occupied) return;
  // If not occupied, set attributes
  if (space && space.elem) {
    space.elem.setAttribute('data-occupied', color);   
  }
};

var spaceAt = function(x, y) {
  var blocks = document.getElementsByClassName('block'); 
  var targetBlock;
  var b;
  for (var i=0; i<blocks.length; i++) {
    b = blocks[i];
    if (b.getAttribute('data-x') == x && b.getAttribute('data-y') == y) {
      targetBlock = b;
    } 
  }
  if (targetBlock) {
    return {
      x: x,
      y: y,
      occupied: targetBlock.getAttribute('data-occupied'),
      elem: targetBlock
    };
  }
}; 

/* Ship 1
 */
var ship1tick = function() {
  return [aux.rand(2), aux.rand(2)];
};

var ship2tick = function() {
  return [aux.rand(3)-1, aux.rand(3)-1];
};

/* 
 * Ship 3 
 */
var ship3tick = function() {
  var enemy = (this.color == 'black') ? 'red' : 'black';
  var enemyToRight = false;
  for (var j=-1; j<=1; j++) { // looks up and down
    for (var i=1; i<6; i++) { // looks ahead to the right
      var space = spaceAt(this.x+i, this.y+j);
      if (space && space.occupied/* == enemy*/) {
        enemyToRight = true;
      }
    }
  }

  // If there's an enemy ship in any of the 3 spaces to the right, move right, else move random
  if (enemyToRight) {
    //console.log('enemy to right!');
    return [1, 0];
  } else {
    return [aux.rand(3)-1, aux.rand(3)-1];
  }
};

var allShips = function() {
  var blocks = document.querySelectorAll('.block[data-occupied]'); 
  var ships = [];
  for (var i=0; i<blocks.length; i++) {
    var b = blocks[i];
    var ship = {
      x: parseInt(b.getAttribute('data-x')),
      y: parseInt(b.getAttribute('data-y')),
      occupied: b.getAttribute('data-occupied'),
      color: b.getAttribute('data-occupied'),
      elem: b
    };
    if (ship.occupied == 'red') {
      ship.tick = ship3tick;
    } else if (ship.occupied == 'black') {
      ship.tick = shipModels["Red Mark 1"].tick;
    }
    ships.push(ship);
  }
  document.getElementById('redShip').innerText = "ship3tick";
  document.getElementById('blackShip').innerText =  "Red Mark 1";
  return ships;
};

var remove = function(x, y, callback) {
  var space = spaceAt(x, y);
  if (space && space.elem) {
    space.elem.removeAttribute('data-occupied');
    if (callback) callback();
  }
};

var move = function(ship, dir) {
  // TODO: if ok,
  var newX = ship.x+dir[0];
  var newY = ship.y+dir[1];
  var newSpace = spaceAt(newX, newY);
  if (!newSpace || newSpace.occupied) return;
  // remove current
  remove(ship.x, ship.y);
  // occupy next
  occupy(ship.occupied, newX, newY);
};

var interval;
var turn = 0;
var beginMatch = function() {

  var numReds = starting;
  var numBlacks = starting;
  var newNumReds = 0;
  var newNumBlacks = 0;

  interval = setInterval(function() {
    turn++;

    newNumReds = 0;
    newNumBlacks = 0;
  
    // Tick all ships
    var ships = allShips();
    for (var i=0; i<ships.length; i++) {
      var ship = ships[i];

      if (ship.color == 'black') {
        newNumBlacks++;
      } else if (ship.color == 'red') {
        newNumReds++;
      }

      // If this ship has no liberties, destroy it
      var left = spaceAt(ship.x-1, ship.y);
      var right = spaceAt(ship.x+1, ship.y);
      var up = spaceAt(ship.x, ship.y+1);
      var down = spaceAt(ship.x, ship.y-1);
      if (((left && left.occupied) || !left)
       && ((right && right.occupied) || !right)
       && ((up && up.occupied) || !up)
       && ((down && down.occupied) || !down)) {
        remove(ship.x, ship.y, function() {
          if (ship.occupied == 'black') {
            numBlacks--;
          } else if (ship.occupied == 'red') {
            numReds--;
          }
        });
      }

      var dir = ship.tick();
      if (dir && dir.length == 2) {
        move(ship, dir);
      } 
    }

    // If someone has won the game
    if (newNumReds == 0) {
      console.log("Black wins! (?)");
      stopMatch();
    } else if (newNumBlacks == 0) {
      stopMatch();
      console.log("Red wins! (?)");
    }

    // Update DOM
    document.getElementById('numBlack').innerText = newNumBlacks;
    document.getElementById('numRed').innerText = newNumReds;
    document.getElementById('turn').innerText = turn;

  }, 500);
}; 

var stopMatch = function() {
  clearInterval(interval);
  console.log(turn, 'turns');
};

// BEGIN
setUpGrid();
beginMatch();
