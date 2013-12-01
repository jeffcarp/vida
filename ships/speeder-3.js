register("Speeder 3", function(color, text) {

  /* New in Speeder 3
   * findTarget, instead of just finding the enemy ship with
   * the lowest id, now attempts to get the enemy ship that
   * has the closest average distance from all friendly ships.
   */

  /* Required */
  this.color = color;
  this.text = text;
  this.x;
  this.y;
  this.uid;

  /* Targeting */
  this.target;
  this.enemyColor = (this.color == 'black') ? 'red' : 'black';

  this.tick = function(turn, ships) {

    if (!this.targetStillExists(ships)) {
      this.target = null;
    }

    // if we don't have a target
    if (!this.target) {
      // get our 4 closest neighbors
      // if one of them has a target, use that one
      // if they all have the same target, find a new one
      var allSame = true;
      var neighbors = this.findNClosestFriends(this, ships, 4);
      var useThis;
      for (var i in neighbors) {
        var ship = neighbors[i];
        if (ship.target && this.shipStillExists(ships, ship.target)) {
          useThis = ship.target;
          if (neighbors[i-1] && (neighbors[i-1].uid != ship.uid)) {
            allSame = false;
          }
        }
      }
      if (useThis) {
        this.target = useThis;
      }

      // if not, find the closest enemy and lock on
      if (!this.target || allSame) {
        this.target = this.findTarget(ships); 
      }
    }

    var vector;
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
      return this.randomLiberty(ships);
    }
  };

  this.distanceToShip = function(ship) {
    var x = ship.x - this.x;
    var y = ship.y - this.y;
    return Math.abs(x) + Math.abs(y);
  };

  this.findNClosestFriends = function(self, ships, n) {
    return ships.filter(function(s) {
      if (s.color == self.color) return s;
    }).sort(function(a, b) {
      var aDist = self.distanceToShip(a);
      var bDist = self.distanceToShip(b);
      if (aDist > bDist) {
        return -1;
      } else if (bDist > aDist) {
        return 1;
      } else {
        return 0;
      }
    }).slice(0, n);
  };

  this.enemies = function(ships) {
    return ships.filter(function(s) {
      if (s.color == this.enemyColor) return s;
    }, this);
  };

  // Find the closest
  this.findTarget = function(ships) {

    var enemies = this.enemies(ships) || []; 
    var closestEnemyDist;
    var closestEnemy;

    for (var i in enemies) {
      var e = enemies[i];
      var dist = this.distanceToShip(e);
      if (!closestEnemyDist || dist < closestEnemyDist) {
        closestEnemyDist = dist;
        closestEnemy = e;
      }
    }
    return closestEnemy;
  };

  this.targetStillExists = function(ships) {
    return this.shipStillExists(ships, this.target); 
  };   

  this.shipStillExists = function(ships, target) {
    if (!target) return false;
    for (var i in ships) {
      var ship = ships[i];
      if (target.uid == ship.uid) return true; 
    }
    return false;
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
  this.randomLiberty = function(ships) {
    var randLiberty = [0, 0];
    var libs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (var i in libs) {
      var lib = libs[i];
      if (liberty(ships, this.x+lib[0], this.y+lib[1])) {
        randLiberty = lib;
      } 
    }
    return randLiberty;
  };

});
