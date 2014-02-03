/* 
# Vida Renderer

## Coordinate System
- Origin is the center (think cartesian plane, not GUI programming)

*/

var render = {};

var canvas;
var ctx;
var setup = false;
render.offsetX = 0;
render.offsetY = 0;

render.init = function(config) {

  setup = true;

  var gridID = "grid";
  var blockSize = config.blockSize;
  canvas = document.getElementById(gridID);
  render.offsetX = render.offsetY = window.innerHeight/2;

  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
  }
  else {
    alert("Please switch to a browser that supports canvas.");
  }

  render.resetCanvasAspect();

      // Keep canvas's aspect ratio the same
  window.onresize = function(e) {
    render.resetCanvasAspect();
  };

  var enteredX = null;
  var enteredY = null;
  var ofsX = null;
  var ofsY = null;

  canvas.addEventListener("mousedown", function(e) { 
    console.log("mousedown");
    enteredX = e.x - canvas.offsetLeft;
    enteredY = e.y - canvas.offsetTop;
    ofsX = render.offsetX;
    ofsY = render.offsetY;
  });


  canvas.addEventListener("mouseup", function(e) {
    console.log("mouseup");
    enteredX = null;
    enteredY = null;
    ofsX = null;
    ofsY = null;
  });

  canvas.addEventListener("mouseout", function(e) {
    console.log("mouseout");
    enteredX = null;
    enteredY = null;
    ofsX = null;
    ofsY = null;
  });

  canvas.addEventListener("mousemove", function(e) {
    if (!enteredX || !enteredY) return; 

    var ex = e.x - canvas.offsetLeft;
    var ey = e.y - canvas.offsetTop;
    console.log("ex, ey", ex, ey);
    console.log("entered", enteredX, enteredY);

    render.offsetX = (ex - enteredX) + ofsX;
    render.offsetY = (ey - enteredY) + ofsY;
    console.log("offsets", render.offsetX, render.offsetY);
    //render.draw();
  });

  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();


  // usage:
  // instead of setInterval(render, 16) ....

  (function animloop(){
    requestAnimFrame(animloop);
    render.draw();
  })();

};

render.resetCanvasAspect = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

render.cachedCells;
render.cachedTunnels;
render.cachedBases;
render.cachedBlockSize;

render.setVars = function(game, config) {
  game = game || {};
  config = config || {};

  var cells = game.cells || render.cachedCells || [];
  var tunnels = game.tunnels || render.cachedTunnels || [];
  var bases = game.bases || render.cachedBases || [];
  var blockSize = config.blockSize || render.cachedBlockSize || 2;

  render.cachedCells = cells;
  render.cachedTunnels = tunnels;
  render.cachedBases = bases;
  render.cachedBlockSize = blockSize;
};

// Takes a game state from runner.js and draws that on a canvas 
render.draw = function(game, config) {

  if (!setup) render.init(config);

  game = game || {};
  config = config || {};

  var cells = game.cells || render.cachedCells || [];
  var tunnels = game.tunnels || render.cachedTunnels || [];
  var bases = game.bases || render.cachedBases || [];
  var blockSize = config.blockSize || render.cachedBlockSize || 2;

  render.cachedCells = cells;
  render.cachedTunnels = tunnels;
  render.cachedBases = bases;
  render.cachedBlockSize = blockSize;

  // Clear grid
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bases.forEach(function(base) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(
      (base.x*blockSize)+render.offsetX, 
      (base.y*blockSize)+render.offsetY, 
      blockSize, 
      blockSize);
  });

  tunnels.forEach(function(tunnel) {
    ctx.fillStyle = "#111";
    ctx.fillRect(
      (tunnel.x*blockSize)+render.offsetX, 
      (tunnel.y*blockSize)+render.offsetY, 
      blockSize, 
      blockSize);
  });

  cells.forEach(function(cell) {
    ctx.fillStyle = "blue";//cell.color == "black" ? "black" : "maroon";

    // Now instead of just going from the origin, we have to convert
    //   our cells' central origin coords to the canvas's top left coords
    // I feel like we just have to add half the canvas size
    ctx.fillRect(
      (cell.x*blockSize)+render.offsetX, 
      (cell.y*blockSize)+render.offsetY, 
      blockSize, 
      blockSize);
  });

};

module.exports = render;
