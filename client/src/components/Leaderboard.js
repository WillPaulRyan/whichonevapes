import React from "react";
import axios from "axios";
import './Leaderboard.css';

export default class Leaderboard extends React.Component {
  state = {
    top: [],
    bottom: [],
    isLoaded: false
  }

  // Load celeb list into state asynchronously
  componentDidMount() {
    axios
      .get(`/api/celebs/leaderboard`)
      .then(res => {
        this.setState({
          top: res.data.top,
          bottom: res.data.bottom,
          isLoaded: true
        });

      })
      .catch(err => console.log(err));
  }

  render() {
    const top = this.state.top.map((celeb, i) => {
      return (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{celeb.name}</td>
          <td>{celeb.elo}</td>
        </tr>
      )
    })

    const bottom = this.state.bottom.map((celeb, i) => {
      return (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{celeb.name}</td>
          <td>{celeb.elo}</td>
        </tr>
      )
    })

    return (
      <div id="leaderboard-container">
        <h2>Leaderboard</h2>
        {this.state.isLoaded ? (
          <div id="leaderboard">
            <table>
              <caption>Most likely to vape</caption>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Elo</th>
                </tr>
              </thead>
              <tbody>
                {top}
              </tbody>
            </table>
            <table>
              <caption>Least likely to vape</caption>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Elo</th>
                </tr>
              </thead>
              <tbody>
                {bottom}
              </tbody>
            </table>
          </div>
        ) : (
          <h3>Loading...</h3>
        )}
      </div>
    )
  }
}
