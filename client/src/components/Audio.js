import React from 'react';
import './Audio.css'

export default class Audio extends React.Component {
  state = {
    showAudio: false
  }

  handleClick() {
    this.setState((state) => ({
      showAudio: !state.showAudio
    }))
  }

  render() {
    return (
      <div id="audio-container">
        {this.state.showAudio ? (
          <div>
            <audio controls preload="metadata" id="episode">
              <source src="./mbmbam321.mp3" />
              Your browser does not support the <code>audio</code> element.
            </audio>
            <p className="warning">Check your headphones, it may be loud.</p>
          </div>
          ) : (
            <div>
              <button onClick={this.handleClick.bind(this)}>Listen to MBMBAM episode 321: Which One Vapes</button>
              <p className="warning">Warning: Listening will use 34MB of data, make sure you're on wifi</p>
            </div>
          )}
      </div>
    )
  }
}