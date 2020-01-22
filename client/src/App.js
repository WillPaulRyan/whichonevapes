import React from "react";
import axios from "axios";
import sampleSize from "lodash.samplesize";
import Card from "./components/Card";
import Audio from "./components/Audio";
import "./App.css";

class App extends React.Component {
  state = {
    celebList: [],
    currentA: { name: "" },
    currentB: { name: "" },
    nextA: { name: "" },
    nextB: { name: "" },
    isLoaded: false
  };

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

  // Load celeb list asynchronously
  componentDidMount() {
    axios
      .get(`/api/celebs`)
      .then(res => {
        // Pull first 4 celebs and load list into state
        let random = sampleSize(res.data, 4);
        this.setState({
          currentA: random[0],
          currentB: random[1],
          celebList: res.data,
          isLoaded: true,
          nextA: random[2],
          nextB: random[3]
        });

        // Preload celebs' images
        random.forEach(celeb => {
          new Image().src = `./celeb_pics/${celeb.pic}`;
        })
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <main>
          <h1>Which One Vapes?</h1>
          {this.state.isLoaded ? (
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
            <h3>Loading...</h3>
          )}
          <Audio />
        </main>

        <video playsInline autoPlay muted loop poster="./poster.jpg">
          <source src="./bg_video.webm" type="video/webm" />
          <source src="./bg_video.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }
}

export default App;
