register("Vice Mark 3", function(color, text) {

  /* Vice Mark 3 introduces the concepts of running away
   * and generally being more careful in the ships' movements.
   */ 

  this.color = color;
  this.enemyColor = (this.color == 'black') ? 'red' : 'black';
  this.text = text;
  this.x = null;
  this.y = null;

  this.target = null;
  this.turnTargeted = null;

  this.liberties = function(map, x, y) {
    var liberties = 4;
    if (!liberty(map, x-1, y)) liberties--;
    if (!liberty(map, x+1, y)) liberties--;
    if (!liberty(map, x, y-1)) liberties--;
    if (!liberty(map, x, y+1)) liberties--;
    return liberties;
  };

  this.determineTarget = function(ships) {
    for (var i=0; i<ships.length; i++) {
      var ship = ships[i];
      if (ship.color == this.enemyColor) {
        this.target = ship; 
        break;
      }
    }
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
    console.log([this.x-randLiberty[0], this.y-randLiberty[1]]);
    return [this.x-randLiberty[0], this.y-randLiberty[1]];
  };

  this.tick = function(map, turn, ships) {


    // Primary goals
    // - Don't move into a bad situation
    //   - If the ship has only one liberty left, move into the open liberty

    // Go through each enemy ship and target the first one (everybody does)

    this.determineTarget(ships);

    // TRIAL
    // If this ship has 1 or 2 liberties, move into one of those liberties
    var moveLiberty;
    if (this.liberties(map, this.x, this.y) < 3) {
      var x = this.x;
      var y = this.y;
      [[x-1, y], [x+1, y], [x, y-1], [x, y+1]].forEach(function(t) {
        if (liberty(map, t[0], t[1])) moveLiberty = [t[0], t[1]];
      });
    }

    if (this.target 
     && this.turnTargeted != null
     && turn - this.turnTargeted > 10) {
      this.findTarget(map, turn);
    } else if (!this.target) {
      this.findTarget(map, turn);
    }

    if (moveLiberty) {
      return moveLiberty;
    } else if (this.target && turn % 3 != 0) {
      // Move toward the target if possible
      var x = 0;
      var y = 0;
      if (this.target.x > this.x) x = 1; 
      if (this.target.x < this.x) x = -1; 
      if (this.target.y > this.y) y = 1; 
      if (this.target.y < this.y) y = -1; 
      if (occupied(this.x+x, this.y+y)) {
        return [0, 0];
      } else {
        return [x, y];
      }
    } else {
      // Else move randomly
      return this.randomLiberty(map);
    }
  };

});
