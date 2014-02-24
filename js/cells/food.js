var food = {};

var cellutil = require("./util");
var aux = require("../helpers");

food.reproductionRate = 30;
food.passEnergy = 50;

food.alleles = {
  reproductionRate: 30,
  passEnergy: 100
};

food.tick = function(cell, neighborhood, messages, time) {
  // Composable block
  if (cell.age % food.reproductionRate == 0 && cell.energy > food.passEnergy) {
    return [2, 2]; // Reproduce
  }

  return [0, 0];
  //return cellutil.randDir();
};

module.exports = food;
