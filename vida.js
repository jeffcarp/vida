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

        <section>
          <h4>AI</h4>

          <p className="pdb">Black <b>{this.props.blackAI}</b></p>
          <p>Red <b>{this.props.blackAI}</b></p>
        </section>
      </td>
    );
  }
});

var CenterTab = React.createClass({
  render: function() {
    return (
      <td className="centerTab">
        <MessageBar message={this.props.message} />
        <canvas id="grid" width="400" height="400"></canvas>
      </td>
    );
  }
});

var MessageBar = React.createClass({
  render: function() {
    var show = this.props.message.length > 0 ? "show": "";
    return (
      <div 
      id="message-bar" 
      className={show}
      >{this.props.message}</div> 
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
      message: "",
      running: false,
      turn: 0,
      blackAI: window.blackPrototype,
      redAI: window.redPrototype
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

    window.winCallback = (function(msg) {
      this.setState({message: msg});
    }).bind(this);

    this.setState({
      blackAI: window.blackPrototype,
      redAI: window.redPrototype
    });

  },
  changeSpeed: function() {
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
            blackAI={this.state.blackAI} 
            redAI={this.state.redAI} 
            changeSpeed={this.changeSpeed} 
            toggleRunning={this.toggleRunning} 
            />
          <CenterTab 
            message={this.state.message} 
            />
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
