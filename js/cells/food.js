var food = {};

var cellutil = require("./util");
var aux = require("../helpers");

food.tick = function(cell, neighborhood, messages, time) {
  return cellutil.randDir();
};

module.exports = food;
