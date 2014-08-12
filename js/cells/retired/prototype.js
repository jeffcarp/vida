register("Your Ship Prototype Name", function(color, text) {

  // Required values
  this.color = color;
  this.text = text;
  this.x = null;
  this.y = null;

  // Sample Custom values 
  this.target = null;
  this.turnTargeted = null;

  /* Tick is the only required function your
   * ship must have. It is called on every turn.
   * Ships can move at most one space per turn. 
   * You must return a vector indicating the direction
   * you want this ship to move. For example:
   * [0, 0] - stay put
   * [-1, 0] - go left 1
   * [1, 0] - go right 1
   * [0, -1] - go up 1    // vertical coordinates are reversed...
   * [0, 1] - go down 1   // think iOS GUI development
   */
  this.tick = function(turn, ships) {
    return [aux.rand(3)-1, aux.rand(3)-1];
  };

});
