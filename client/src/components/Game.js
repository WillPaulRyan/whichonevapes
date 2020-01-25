import React from "react";
import axios from "axios";
import sampleSize from "lodash.samplesize";
import Card from './Card';
import Leaderboard from './Leaderboard';
import './Game.css';

export default class Game extends React.Component {
  state = {
    celebList: this.props.celebList,
    currentA: { name: "" },
    currentB: { name: "" },
    nextA: { name: "" },
    nextB: { name: "" },
    gameView: true
  }

  handleView() {
    this.setState((state) => ({
      gameView: !state.gameView
    }))
  }

  async logWinner(winner, loser) {
    axios
      .patch(`/api/celebs/${winner}/${loser}`)
      .then(res => console.log(res.data.msg))
  }

  handleA() {
    this.logWinner(this.state.currentA._id, this.state.currentB._id);
    this.updateCurrents();
  }

  handleB() {
    this.logWinner(this.state.currentB._id, this.state.currentA._id);
    this.updateCurrents();
  }

  updateCurrents() {
    // Move next celebs to current status and stage two new celebs for next round
    this.setState(state => ({currentA: state.nextA, currentB: state.nextB}));
    let nextCelebs = sampleSize(this.state.celebList, 2)
    this.setState({ nextA: nextCelebs[0], nextB: nextCelebs[1] })

    // Preloads next 2 celeb pics
    nextCelebs.forEach(celeb => {
      new Image().src = `./celeb_pics/${celeb.pic}`
    })    
  }

  componentDidMount() {
    // Pull 4 random celebs and log into state
    let random = sampleSize(this.props.celebList, 4);
    this.setState({
      currentA: random[0],
      currentB: random[1],
      nextA: random[2],
      nextB: random[3]
    });

    // Preload 2nd set of celebs' images
    // Using .split() to remove currentA+B would load in sub-optimal order
    random.forEach(celeb => {
      new Image().src = `./celeb_pics/${celeb.pic}`;
    })
  }

  render() {
    return (
      <div id="game-container">
        {this.state.gameView ? (
          <div id="game">
            <Card
              id="A"
              celeb={this.state.currentA}
              handleClick={this.handleA.bind(this)}
            />
            <Card
              id="B"
              celeb={this.state.currentB}
              handleClick={this.handleB.bind(this)}
            />
          </div>
        ) : (
          <Leaderboard />
        )}
        <button onClick={this.handleView.bind(this)}>
          {this.state.gameView ? 'View Leaderboard' : 'Play Game'}
        </button>
      </div>
);
  }
}
