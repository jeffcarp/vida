var React = require('react');
var d = React.DOM;

var Right = module.exports = React.createClass({
  getInitialState: function() {
    return ({
      population: 0,
      totalEnergy: 0,
      averageAge: 0,
      totalTime: 0
    });
  },
  componentDidMount: function() {
    this.props.bus.on("end tick", function(data) {
      this.setState({
        population: data.population,
        totalEnergy: data.totalEnergy,
        averageAge: data.averageAge,
        totalTime: data.totalTime
      });
    }.bind(this));
  },
  render: function() {
    return d.div({id: 'right'},
      d.h1(null, 'Population'),
      d.p({className: "mfb"},
          "Total: ",
          null, this.state.population,
          " cells"),
      d.p({className: "mfb"},
          "Total energy: ",
          this.state.totalEnergy),
      d.p({className: "mfb"},
          "Total time x: ",
          this.state.totalTime),
      d.p({className: "mfb"},
          "Energy/Population: ",
          d.span(null, ratio)),
          d.p({className: "mfb"},
              "Average age: ",
              this.state.averageAge.toFixed(2),
              " ticks"));
  }
});
