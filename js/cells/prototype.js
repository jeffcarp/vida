var ai = {};

var cellutil = require("./util");

ai.tick = function(cell, neighborhood, messages, time) {
  return cellutil.randDir();
};

module.exports = ai;
