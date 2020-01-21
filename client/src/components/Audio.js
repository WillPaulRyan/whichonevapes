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
          <audio controls preload="metadata" id="episode">
            <source src="./mbmbam321.mp3" />
            Your browser does not support the <code>audio</code> element.
          </audio>
          ) : (
            <div id="button-container">
              <button onClick={this.handleClick.bind(this)}>Listen to MBMBAM episode 321: Which One Vapes</button>
              <p className="warning">Warning: don't do this on mobile data</p>
              <p className="warning">Also, it may be loud. Turn down your headphone volume.</p>
            </div>
          )}
      </div>
    )
  }
}