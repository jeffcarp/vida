var aux = {};

// num is EXCLUSIVE
aux.rand = function(num) {
  return Math.floor(Math.random()*num);
};

aux.randOrigin = function(num) {
  return Math.floor(Math.random()*(num*2)) - num;
};

module.exports = aux;
