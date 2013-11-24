register("Speeder 1", function(color, text) {

  /* Required */
  this.color = color;
  this.text = text;
  this.x;
  this.y;

  /* Targeting */
  this.target;
  this.enemyColor = (this.color == 'black') ? 'red' : 'black';

  this.tick = function(turn, ships) {

    var vector;
    if (!this.target) {
      this.target = this.findTarget(ships); 
    }
    if (this.target) {
      var targetLX;
      var targetLY;

      // Get path to first open liberty of target
      var libs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (var i in libs) {
        var lib = libs[i];
        if (liberty(ships, this.target.x+lib[0], this.target.y+lib[1])) {
          targetLX = this.target.x+lib[0];
          targetLY = this.target.y+lib[1];
        } 
      }

      if (targetLX && targetLY) {
        vector = this.vectorToward(ships, this.x, this.y, targetLX, targetLY);
      }
    }

    if (vector) {
      return vector; 
    } else {
      return [aux.rand(3)-1, aux.rand(3)-1];
    }
  };

  this.findTarget = function(ships) {
    for (var i in ships) {
      var ship = ships[i];
      if (ship.color == this.enemyColor) {
        return ship; 
      }
    }
  };

  this.vectorToward = function(ships, startX, startY, endX, endY) {
      var x = 0;
      var y = 0;
      if (endX > startX) x = 1; 
      if (endX < startX) x = -1; 
      if (endY > startY) y = 1; 
      if (endY < startY) y = -1; 
      if (occupied(ships, startX+x, startY+y)) {
        return null;
      } else {
        return [x, y];
      }
  };

  // Unused
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

});
