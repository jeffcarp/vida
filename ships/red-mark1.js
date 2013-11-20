var ShipBuilder = function() {

  var Ship = {
    version: "0.0.1",
    name: "Red"
  };

  /* 
   * Called to decide what this ship will do
   * in its turn. 
   *
   * moving range is 1 block in every direction (not diag) 
   * if the desired space is empty, the ship moves there
   * if there's a ship in the desired space and there's room, it is pushed
   * if there's no room to push, nothing happens 
   * 
   * return false;   // Do nothing
   * return [1, 0];  // Moves ship down one (if legal)
   * return [-1, 0]; // Moves ship up one (if legal)
   * return [0, 1];  // Moves ship right one (if legal)
   * return [0, -1]; // Moves ship left one (if legal)
  */
  Ship.tick = function(localMap, numPeers, numEnemies, turn) {
  };

  return Ship;
};
