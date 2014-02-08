/** @jsx React.DOM */

var runner = require("./runner");
var render = require("./render");

var Left = React.createClass({
  getInitialState: function() {
    return ({
      population: 0
    });
  },
  updatePopulation: function(data) {
    this.setState({
      population: data.population
    });
  },
  componentWillMount: function() {
  },
  componentDidMount: function() {
    var self = this;
    runner.on("end tick", function(data) {
      self.updatePopulation(data);
    });
  },
  setZoom: function(direction) {
    direction === "out" ? render.zoomOut() : render.zoomIn();
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
            onClick={runner.toggleStartStop}
            >Start/Stop</div>
        </div>

        <h2 className="mfb">Statistics</h2>
        <p className="mfb">Population: <span>{this.state.population}</span></p>

        <h2 className="mfb">Introduce AIs</h2>

        <div 
          onClick={runner.introduce}
          className="butn"
          >Rando</div>

      </div>
    );
  }
});

React.renderComponent(
  <Left />,
  document.getElementById('controls')
);
