register("Vice Mark 1", function(color, text) {

  this.color = color;
  this.text = text;
  this.x = null;
  this.y = null;
  this.target = null;
  this.turnTargeted = null;

  this.findTarget = function(map, turn) {
    var enemyColor = (this.color == 'black') ? 'red' : 'black';
    for (var j=-3; j<=3; j++) { // look up and down
      for (var i=-3; i<=3; i++) { // look left and right
        var space = at(map, this.x+i, this.y+j);
        if (space && space.ship) {
          if (space.ship.color == enemyColor) {
            this.target = space.ship;
            this.turnTargeted = turn;
            return space.ship;
          }
        }
      }
    }
  };

  this.tick = function(map, turn) {

    // Search in a 3 square radius around the ship
    // Find a target
    // Remember that and follow that target

    if (this.target 
     && this.turnTargeted != null
     && turn - this.turnTargeted > 10) {
      this.findTarget(map, turn);
    } else if (!this.target) {
      this.findTarget(map, turn);
    }

    if (this.target) {
      // Move toward the target if possible
      var x = 0;
      var y = 0;
      if (this.target.x > this.x) x = 1; 
      if (this.target.x < this.x) x = -1; 
      if (this.target.y > this.y) y = 1; 
      if (this.target.y < this.y) y = -1; 
      return [x, y];
    } else {
      // Else move randomly
      return [aux.rand(3)-1, aux.rand(3)-1];
    }
  };

});
