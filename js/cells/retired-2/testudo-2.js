register("Testudo 2", function(color, text) {

  /* Testudo 1's approach:
   * 
   * Under the current ruleset, it is impossible to capture
   * a piece if one of its liberties are inaccessible.
   * Testudo ships attempt to create a grid formation
   * such that it maximises the number of inaccessible liberties.
   *    x
   *   x x
   *    x
   *
   * During a tick, a Tetsudo ship finds its nearest friendly neighbor,
   * routes a path to it, and attaches itself in a clockwise manner.
   * Once the ship is attached, it stops moving. 
   */ 

  this.color = color;
  this.enemyColor = (this.color == 'black') ? 'red' : 'black';
  this.text = text;
  this.x = null;
  this.y = null;

  this.target = null;
  this.targetLiberty = null;
  this.turnTargeted = null;

  this.liberties = function(map, x, y) {
    var liberties = 4;
    if (!liberty(map, x-1, y)) liberties--;
    if (!liberty(map, x+1, y)) liberties--;
    if (!liberty(map, x, y-1)) liberties--;
    if (!liberty(map, x, y+1)) liberties--;
    return liberties;
  };

  // TODO: Improve this to find the path
  this.distanceToShip = function(map, ship) {
    return Math.abs(ship.x - this.x) + Math.abs(ship.y - this.y);
  };

  /* Find the shortest distance to a friendly ship
   */
  this.determineTarget = function(map, ships) {
    var targetShip;
    var targetShipDist;
    for (var i=0; i<ships.length; i++) {
      var ship = ships[i];
      if (ship.color == this.color && ship.text !== this.text) {
        var dist = this.distanceToShip(map, ship);
        if (dist < targetShipDist || !targetShipDist) {
          targetShip = ship;
          targetShipDist = dist;
        }
      }
    }
    //console.log(this.color, this.text, "is", targetShipDist, "from", targetShip.text);
    this.target = targetShip; 
  };

  this.randomLiberty = function(map) {
    var randLiberty = [0, 0];
    var x = this.x;
    var y = this.y;
    var tonari = [[x-1, y], [x+1, y], [x, y-1], [x, y+1]];
    for (var i in tonari) {
      var t = tonari[i];
      if (liberty(map, t[0], t[1])) randLiberty = [t[0], t[1]];
    }
    //console.log([this.x-randLiberty[0], this.y-randLiberty[1]]);
    return [this.x-randLiberty[0], this.y-randLiberty[1]];
  };

  this.vectorToward = function(map, startX, startY, endX, endY) {
      var x = 0;
      var y = 0;
      if (endX > startX) x = 1; 
      if (endX < startX) x = -1; 
      if (endY > startY) y = 1; 
      if (endY < startY) y = -1; 
      if (occupied(startX+x, startY+y)) {
        return [0, 0];
      } else {
        return [x, y];
      }
  };

  this.tick = function(map, turn, ships) {
    this.determineTarget(map, ships);

    // If there's already a friend on a diagonal, do nothing
    var x = this.x;
    var y = this.y;
    var tonari = [[x-1, y-1], [x-1, y+1], [x+1, y+1], [x+1, y-1]];
    for (var i in tonari) {
      var t = tonari[i];
      var space = at(map, t[0], t[1]);
      if (space && space.ship && space.ship.color == this.color) {
        return [0, 0];
      }
    }

    if (this.target) {
      // Go through liberties clockwise, pick the first one and go for it
      if        (!occupied(map, this.target.x-1, this.target.y-1)) {
        return this.vectorToward(map, this.x, this.y, this.target.x-1, this.target.y-1);
      } else if (!occupied(map, this.target.x+1, this.target.y-1)) {
        return this.vectorToward(map, this.x, this.y, this.target.x+1, this.target.y-1);
      } else if (!occupied(map, this.target.x-1, this.target.y+1)) {
        return this.vectorToward(map, this.x, this.y, this.target.x-1, this.target.y+1);
      } else if (!occupied(map, this.target.x+1, this.target.y+1)) {
        return this.vectorToward(map, this.x, this.y, this.target.x+1, this.target.y+1);
      } else {
        return [0, 0];
      }
    } else {
      return [0, 0];
    }
  };

});
