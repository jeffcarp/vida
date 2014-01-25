var aux = {};

aux.rand = function(num) {
  return Math.floor(Math.random()*num);
};

aux.write = function(id, text) {
  document.getElementById(id).innerText = text;
};

aux.html = function(id, str) {
//  document.getElementById(id).innerHTML = str;
};

aux.append = function(id, text) {
  var elem = document.getElementById(id);
  if (!elem) return;
  var oldText = elem.innerHTML; 
  elem.innerHTML = oldText+"<br />"+text;
};
