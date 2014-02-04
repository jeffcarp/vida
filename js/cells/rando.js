var protoai = {};

var cellutil = require("./util");

protoai.tick = function(cell, neighborhood, messages, time) {
  return cellutil.randDir();
};

module.exports = protoai;
