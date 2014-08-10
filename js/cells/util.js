var cellutil = {};

var aux = require("../helpers");

cellutil.randDir = function() {
  var move = [0, 0];
  var i = aux.rand(2);
  var j = aux.rand(2);
  if (j === 0) j -= 1;
  move[i] = j;
  return move;
};

module.exports = cellutil;
