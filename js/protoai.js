var protoai = {};

var cellutil = require("./cellutil");

protoai.tick = function(cell, neighborhood, messages, time) {
  /*
  if (time % 2 == 0) {
    return [0, 1];
  }
  else {
  */
    return cellutil.randDir();
  //}
};

module.exports = protoai;
