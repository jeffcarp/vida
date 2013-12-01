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
        ship: null 
      });
    }
    map.push(newRow);
  }
  return map;
};

aux.write = function(id, text) {
  document.getElementById(id).innerText = text;
};

aux.html = function(id, str) {
  document.getElementById(id).innerHTML = str;
};

aux.append = function(id, text) {
  var elem = document.getElementById(id);
  if (!elem) return;
  var oldText = elem.innerHTML; 
  elem.innerHTML = oldText+"<br />"+text;
};
