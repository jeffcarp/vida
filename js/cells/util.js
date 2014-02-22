var cellutil = {};

var aux = require("../helpers");

cellutil.randDir = function() {
  var move = [0, 0];
  var i = aux.rand(2);
  move[i] = aux.rand(3)-1; 
  return move;
};

module.exports = cellutil;
