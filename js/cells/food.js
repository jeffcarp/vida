var food = {};

var cellutil = require("./util");
var aux = require("../helpers");

food.tick = function(cell, neighborhood, messages, time) {

  if (cell.age > 20 && aux.rand(17) === 1) {
    return [2, 2]; // Reproduce
  }

  return cellutil.randDir();
};

module.exports = food;
