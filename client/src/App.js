import React from "react";
import axios from "axios";
import Game from "./components/Game";
import Audio from "./components/Audio";
import "./App.css";

class App extends React.Component {
  state = {
    celebList: [],
    isLoaded: false
  };


  // Load celeb list into state asynchronously
  componentDidMount() {
    axios
      .get(`/api/celebs`)
      .then(res => {
        this.setState({
          celebList: res.data,
          isLoaded: true,
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
            <Game celebList={this.state.celebList} />
          ) : (
            <h3 id="loading">Loading...</h3>
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
