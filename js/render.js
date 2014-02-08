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
render.zoom = 2;

render.zoomOut = function() {
  render.setZoom(render.zoom + 1);
};

render.zoomIn = function() {
  if (render.zoom <= 1) return;
  render.setZoom(render.zoom - 1);
};

render.setZoom = function(zoom) {
  var prevZoom = render.zoom;
  render.zoom = zoom;
  render.offsetX = (render.offsetX / prevZoom) * render.zoom;
  render.offsetY = (render.offsetY / prevZoom) * render.zoom;
  render.resetCanvasAspect();
};

render.centerCells = function() {
  // Go through all cells, compute average origin
  // Go to that origin
};

render.init = function(config) {

  setup = true;

  var gridID = "grid";
  var blockSize = config.blockSize;
  canvas = document.getElementById(gridID);
  // TODO: Make this respect previous offsets
  // (currently it puts you back at (0, 0)
  render.offsetX = (window.innerWidth/2)*render.zoom;
  render.offsetY = (window.innerHeight/2)*render.zoom;

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
    enteredX = (e.x - canvas.offsetLeft) * render.zoom;
    enteredY = (e.y - canvas.offsetTop) * render.zoom;
    ofsX = render.offsetX;
    ofsY = render.offsetY;
  });


  canvas.addEventListener("mouseup", function(e) {
    enteredX = null;
    enteredY = null;
    ofsX = null;
    ofsY = null;
  });

  canvas.addEventListener("mouseout", function(e) {
    enteredX = null;
    enteredY = null;
    ofsX = null;
    ofsY = null;
  });

  canvas.addEventListener("mousemove", function(e) {
    if (!enteredX || !enteredY) return; 

    var ex = (e.x - canvas.offsetLeft) * render.zoom;
    var ey = (e.y - canvas.offsetTop) * render.zoom;

    render.offsetX = (ex - enteredX) + ofsX;
    render.offsetY = (ey - enteredY) + ofsY;
  });

  window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           function(callback) {
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
  canvas.width = window.innerWidth*render.zoom;
  canvas.height = window.innerHeight*render.zoom;
};

render.cachedCells;
render.cachedBlockSize;

render.setVars = function(game, config) {
  game = game || {};
  config = config || {};

  var cells = game.cells || render.cachedCells || [];
  var blockSize = config.blockSize || render.cachedBlockSize || 2;

  render.cachedCells = cells;
  render.cachedBlockSize = blockSize;
};

// Takes a game state from runner.js and draws that on a canvas 
render.draw = function(game, config) {

  if (!setup) render.init(config);

  game = game || {};
  config = config || {};

  var cells = game.cells || render.cachedCells || [];
  var blockSize = config.blockSize || render.cachedBlockSize || 2;

  render.cachedCells = cells;
  render.cachedBlockSize = blockSize;

  // Clear grid
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  cells.forEach(function(cell) {
    if (cell.type === "food") {
      ctx.fillStyle = "green";
    }
    else {
      ctx.fillStyle = "hsl("+cell.color+", 50%, 40%)";
    }

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
