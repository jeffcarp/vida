var aux = {};

// num is EXCLUSIVE
aux.rand = function(num) {
  return Math.floor(Math.random()*num);
};

module.exports = aux;
