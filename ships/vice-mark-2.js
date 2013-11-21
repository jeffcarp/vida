register("Vice Mark 2", function(color, text) {

  this.color = color;
  this.enemyColor = (this.color == 'black') ? 'red' : 'black';
  this.text = text;
  this.x = null;
  this.y = null;
  this.target = null;

  this.tick = function(map, turn, ships) {

    // Go through each enemy ship and target the first one (everybody does)
    for (var i=0; i<ships.length; i++) {
      var ship = ships[i];
      if (ship.color == this.enemyColor) {
        this.target = ship; 
        break;
      }
    }

    if (this.target 
     && this.turnTargeted != null
     && turn - this.turnTargeted > 10) {
      this.findTarget(map, turn);
    } else if (!this.target) {
      this.findTarget(map, turn);
    }

    if (this.target && turn % 5 != 0) {
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
