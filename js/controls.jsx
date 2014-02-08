/** @jsx React.DOM */

var runner = require("./runner");
var render = require("./render");

var Left = React.createClass({
  setZoom: function(direction) {
    if (direction === "out") {
      render.zoomOut();
    }
    else {
      render.zoomIn();
    }
  },
  introduce: function() {
    runner.introduce();    
  },
  centerCells: function() {
    render.centerCells();    
  },
  render: function() {
    return (
      <div id="left">
        <div className="mfb">
          <div className="mfb"><h1>Welcome to Vida!</h1></div>
          <p className="mfb">Vida is a platform for building and playing with cell AIs written in JavaScript.</p>
          <p className="mfb small">To move, drag the screen around. Try introducing a few new AIs. If you're really adventurous, try the tutorial. As always, contact Jeff with any concerns.</p>
        </div>

        <div className="mfb">
          <div 
            className="butn"
            onClick={this.setZoom.bind(null, "out")}
            >Zoom Out</div>
          <div 
            className="butn"
            onClick={this.setZoom.bind(null, "in")}
            >Zoom In</div>
          <div 
            className="butn"
            onClick={this.centerCells}
            >Center</div>
        </div>

        <h2 className="mfb">Introduce AIs</h2>

        <div 
          onClick={this.introduce}
          className="butn"
          >Rando</div>

        <p className="mfx mfb small">Rando is dumb as a sack of bricks. source code.</p>

        <div 
          onClick={this.introduce}
          className="butn"
          >Speeder - always moving</div>

        <div 
          onClick={this.introduce}
          className="butn"
          >Testudo - reinforced</div>
      </div>
    );
  }
});

React.renderComponent(
  <Left />,
  document.getElementById('controls')
);
