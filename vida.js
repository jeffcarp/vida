/** @jsx React.DOM */

var StartStop = React.createClass({
  render: function() {
    return (
      <div 
        onClick={this.props.toggleRunning}
        className="badge">
        <h3>{this.props.running ? "Stop" : "Start"} Match</h3>
      </div>
    );
  }
});

var Speed = React.createClass({
  render: function() {
    return (
      <div 
        onClick={this.props.changeSpeed}
        className="badge">
        <h3>{this.props.text} Speed</h3>
      </div>
    );
  }
});

var LeftTab = React.createClass({
  render: function() {
    return (
      <td className="leftTab">
        <section>
          <h4>Game controls</h4>

          <StartStop 
            toggleRunning={this.props.toggleRunning} 
            running={this.props.running} 
            />
          <Speed 
            changeSpeed={this.props.changeSpeed} 
            text={this.props.speed} 
            />
        </section>

        <section>
          <h4>Game status</h4>

          <p>Turn <b>{this.props.turn}</b></p>
        </section>
      </td>
    );
  }
});

var CenterTab = React.createClass({
  render: function() {
    return (
      <td className="centerTab">
        <canvas id="grid" width="400" height="400"></canvas>
      </td>
    );
  }
});

var RightTab = React.createClass({
  render: function() {
    var style = {
      width: "50%"
    };
    return (
      <td className="rightTab">
        <section>
          <h4>Distribution of pieces</h4>

          <div className="pieces-distribution">
            <div 
              className="red-percent" 
              style={style}
              id="red-percent">
            </div>
          </div>

          <div className="info">
            <span className="pfr"><span id="numTotal"></span> total</span> 
            <span className="pfr"><span id="numBlack"></span> black</span> 
            <span className="pfr"><span id="numRed"></span> red</span> 
          </div>
        </section>
      </td>
    );
  }
});

var Root = React.createClass({
  getInitialState: function() {
    return {
      speed: "Normal",
      running: false,
      turn: 0 
    };
  },
  toggleRunning: function() {
    this.setState({running: !this.state.running});
    if (this.state.running) {
      window.pause();
    }
    else {
      window.begin();
    }
  },
  componentWillMount: function() {
    window.turnCallback = (function(turn) {
      this.setState({turn: turn});
    }).bind(this);
  },
  changeSpeed: function() {
    console.log("changeSpeed");
    if (this.state.speed == "Normal") {
      window.pause();
      window.rotationSpeed = 500;
      setTimeout(begin, 1000);
      window.begin();
      this.setState({speed: "Slow"});
    }
    else {
      window.pause();
      window.rotationSpeed = 50;
      window.begin();
      this.setState({speed: "Normal"});
    }
  },
  render: function() {
    return (
      <table 
        className="arena">
        <tr>
          <LeftTab 
            speed={this.state.speed}
            turn={this.state.turn}
            running={this.state.running}
            changeSpeed={this.changeSpeed} 
            toggleRunning={this.toggleRunning} 
            />
          <CenterTab />
          <RightTab />
        </tr>
      </table>
    );
  }
});

React.renderComponent(
  <Root />,
  document.getElementById('app')
);
