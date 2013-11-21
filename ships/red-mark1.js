var ShipBuilder = function() {

  var Ship = {
    version: "0.0.1",
    name: "Red Mark 1",
    x: null,
    y: null,
    color: null
  };

  Ship.tick = function(map, numPeers, numEnemies, turn) {
    return [aux.rand(3)-1, aux.rand(3)-1];
  };

  return Ship;
};

console.log('red mark one');
register(ShipBuilder);
