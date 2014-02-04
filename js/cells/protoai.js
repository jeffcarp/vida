var protoai = {};

var cellutil = require("./util");
var aux = require("../helpers");

protoai.tick = function(cell, neighborhood, messages, time) {

  if (cell.age > 20 && aux.rand(19) === 1) {
    return [2, 2]; // Reproduce
  }

  return cellutil.randDir();
};

module.exports = protoai;
