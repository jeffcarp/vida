var protoai = {};

var cellutil = require("./util");

protoai.tick = function(cell, neighborhood, messages, time) {
  var randDir = cellutil.randDir();
  return {
    x: randDir[0],
    y: randDir[1]
  };
};

module.exports = protoai;
