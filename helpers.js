var aux = {};

aux.rand = function(num) {
  return Math.floor(Math.random()*num);
};

aux.createMap = function(size) {
  var map = [];
  for (var i=0; i<size; i++) {
    var newRow = [];
    for (var j=0; j<size; j++) {
      newRow.push({
        x: j, 
        y: i, 
        occupied: false
      });
    }
    map.push(newRow);
  }
  return map;
};
