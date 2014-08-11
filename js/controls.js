var React = require('react');
var Right = require('./components/right');

var toggleStartStop;

var controls = module.exports = function(bus, id) {

  toggleStartStop = function() {
    bus.emit('request game start');
  };

  React.renderComponent(
    Left({
      bus: bus,
      xid: 'left'
    }),
    document.getElementById(id)
  );

  React.renderComponent(
    Right({
      bus: bus,
    }),
    document.getElementById('rightcontrols')
  );
};

var StartStop = React.createClass({displayName: 'StartStop',
  render: function() {
    var text = this.props.running ? "\u25FC Stop" : "\u25BA Start";
    return (
      React.DOM.div({
        className: "butn",
        onClick: this.props.action
        }, text)
    );
  }
});

var Left = React.createClass({
  displayName: 'Left',
  getInitialState: function() {
    return ({
      population: 0,
      totalEnergy: 0,
      averageAge: 0,
      totalTime: 0,
      gameRunning: false
    });
  },
  componentDidMount: function() {

    this.props.bus.on("game start", function() {
      this.setState({gameRunning: true});
    }.bind(this));

    this.props.bus.on("game stop", function() {
      this.setState({gameRunning: false});
    }.bind(this));

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
      React.DOM.div({id: this.props.xid},

        React.DOM.div({className: "mfb"},
          StartStop({
            action: toggleStartStop,
            running: this.state.gameRunning})),

        React.DOM.h2({className: "mfb"}, "Introduce AIs"),

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
