/** @jsx React.DOM */

var runner = require("./runner");
var render = require("./render");

var StartStop = React.createClass({
  render: function() {
    var text = this.props.running ? "Stop" : "Start";
    return (
      <div 
        className="butn"
        onClick={this.props.action}
        >{text}</div>
    );
  }
});

var Left = React.createClass({
  getInitialState: function() {
    return ({
      population: 0,
      totalEnergy: 0,
      averageAge: 0,
      totalTime: 0,
      gameRunning: false
    });
  },
  updatePopulation: function(data) {
    this.setState({
      population: data.population,
      totalEnergy: data.totalEnergy,
      averageAge: data.averageAge,
      totalTime: data.times.total
    });
  },
  componentDidMount: function() {
    var self = this;
    runner.on("game start", function() {
      self.setState({gameRunning: true});
    });
    runner.on("game stop", function() {
      self.setState({gameRunning: false});
    });
    runner.on("end tick", function(data) {
      self.updatePopulation(data);
      if (!self.state.gameRunning) self.setState({gameRunning: true});
    });

    window.addEventListener("keydown", function(e) {
      var letter = String.fromCharCode(e.keyCode);
      if (letter == "S") {
        runner.toggleStartStop();
      }
    });
  },
  setZoom: function(direction) {
    direction === "out" ? render.zoomOut() : render.zoomIn();
  },
  introduceRando: function() {
    runner.introduce("protoai");
  },
  introduceFood: function() {
    runner.introduce("food");
  },
  render: function() {
    var ratio = (this.state.totalEnergy / this.state.population).toFixed(2);
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
          <StartStop
            action={runner.toggleStartStop}
            running={this.state.gameRunning}
            />
        </div>

        <h2 className="mfb">Statistics</h2>
        <p className="mfb">Population: <span>{this.state.population}</span></p>
        <p className="mfb">Total energy: <span>{this.state.totalEnergy}</span></p>
        <p className="mfb">Average age: <span>{this.state.averageAge.toFixed(2)}</span></p>
        <p className="mfb">Ratio: <span>{ratio}</span></p>
        <p className="mfb">Total tick time: <span>{this.state.totalTime.toFixed(2)}</span></p>

        <h2 className="mfb">Introduce AIs</h2>

        <div 
          onClick={this.introduceRando}
          className="butn"
          >ProtoAI</div>

        <div 
          onClick={this.introduceFood}
          className="butn"
          >Food</div>

      </div>
    );
  }
});

React.renderComponent(
  <Left />,
  document.getElementById('controls')
);
