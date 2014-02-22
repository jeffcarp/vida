register("Red Mark 2", function(color, text) {

  this.color = color;
  this.text = text;
  this.x = null;
  this.y = null;

  this.tick = function(map, turn) {
    var enemy = (this.color == 'black') ? 'red' : 'black';
    var enemyToRight = false;
    for (var j=-1; j<=1; j++) { // looks up and down
      for (var i=1; i<6; i++) { // looks ahead to the right
        if (occupied(map, this.x+i, this.y+j)) {
          enemyToRight = true;
        }
      }
    }

    // If there's an enemy ship in any of the 
    // 3 spaces (with 1 up and 1 down variance)
    // to the right, move right, else move random
    if (enemyToRight) {
      //console.log('enemy to right!');
      return [1, 0];
    } else {
      return [aux.rand(3)-1, aux.rand(3)-1];
    }
  };

});
