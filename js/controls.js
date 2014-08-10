var React = require('react');

var toggleStartStop;

var controls = module.exports = function(bus, id) {

  toggleStartStop = function() {
    bus.emit('request game start');
  };

  React.renderComponent(
    Left({bus: bus}),
    document.getElementById(id)
  );
};

var StartStop = React.createClass({displayName: 'StartStop',
  render: function() {
    var text = this.props.running ? "Stop" : "Start";
    return (
      React.DOM.div({
        className: "butn",
        onClick: this.props.action
        }, text)
    );
  }
});

var Left = React.createClass({displayName: 'Left',
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
    this.props.bus.on("game start", function() {
      self.setState({gameRunning: true});
    });
    this.props.bus.on("game stop", function() {
      self.setState({gameRunning: false});
    });
    this.props.bus.on("end tick", function(data) {
      self.updatePopulation(data);
      if (!self.state.gameRunning) self.setState({gameRunning: true});
    });

    window.addEventListener("keydown", function(e) {
      var letter = String.fromCharCode(e.keyCode);
      if (letter == "S") {
        toggleStartStop();
      }
    });
  },
  setZoom: function(direction) {
    direction === "out" ? render.zoomOut() : render.zoomIn();
  },
  introduceProtoai: function() {
    this.props.bus.introduce("protoai");
  },
  introduceRando: function() {
    this.props.bus.introduce("rando");
  },
  introduceFood: function() {
    this.props.bus.introduce("food");
  },
  render: function() {
    var ratio = (this.state.totalEnergy / this.state.population).toFixed(2);
    return (
      React.DOM.div({id: "left"},
        React.DOM.div({className: "mfb"},
          React.DOM.div({className: "mfb"}, React.DOM.h1(null, "Welcome to Vida!")),
          React.DOM.p({className: "mfb"}, "Vida is a platform for building and playing with cell AIs written in JavaScript."),
          React.DOM.p({className: "mfb small"}, "To move, drag the screen around. Try introducing a few new AIs. If you're really adventurous, try the tutorial. As always, contact Jeff with any concerns.")
        ),

        React.DOM.div({className: "mfb"},
          React.DOM.div({
            className: "butn",
            onClick: this.setZoom.bind(null, "out")
            }, "Zoom Out"),
          React.DOM.div({
            className: "butn",
            onClick: this.setZoom.bind(null, "in")
            }, "Zoom In"),
          StartStop({
            action: toggleStartStop,
            running: this.state.gameRunning}
            )
        ),

        React.DOM.h2({className: "mfb"}, "Statistics"),
        React.DOM.p({className: "mfb"}, "Population: ", React.DOM.span(null, this.state.population), " cells"),
        React.DOM.p({className: "mfb"}, "Total energy: ", React.DOM.span(null, this.state.totalEnergy)),
        React.DOM.p({className: "mfb"}, "Energy/Population: ", React.DOM.span(null, ratio)),
        React.DOM.p({className: "mfb"}, "Average age: ", React.DOM.span(null, this.state.averageAge.toFixed(2)), " ticks"),
        React.DOM.p({className: "mfb"}, "Total tick time: ", React.DOM.span(null, this.state.totalTime.toFixed(2)), " ms"),

        React.DOM.h2({className: "mfb"}, "Introduce AIs"),

        React.DOM.div({
          onClick: this.introduceProtoai,
          className: "butn"
          }, "ProtoAI"),

        React.DOM.div({
          onClick: this.introduceRando,
          className: "butn"
          }, "Random"),

        React.DOM.div({
          onClick: this.introduceFood,
          className: "butn"
          }, "Food")

      )
    );
  }
});
