import React from "react";
import axios from "axios";
import sampleSize from "lodash.samplesize";
import Card from "./components/Card";
import "./App.css";

class App extends React.Component {
  state = {
    celebList: [],
    currentA: { name: "" },
    currentB: { name: "" },
    // nextA: { name: "" },
    // nextB: { name: "" },
    isLoaded: false
  };

  handleA() {
    console.log("A clicked...");
    this.updateCurrents();
  }

  handleB() {
    console.log("B clicked...");
    this.updateCurrents();
  }

  updateCurrents() {
    let newCurrents = sampleSize(this.state.celebList, 2);
    this.setState({ currentA: newCurrents[0], currentB: newCurrents[1] });
  }

  // Load celeb list asynchronously
  componentDidMount() {
    axios
      .get(`/api/celebs`)
      .then(res => {
        let random = sampleSize(res.data, 2);
        this.setState({
          currentA: random[0],
          currentB: random[1],
          celebList: res.data,
          isLoaded: true
        });
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
