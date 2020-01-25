import React from "react";
import "./Card.css";

class Card extends React.Component {
  render() {
    return (
      <div id={this.props.id} className="card" onClick={this.props.handleClick}>
        <h2>{this.props.celeb.name}</h2>
        <img
          src={`./celeb_pics/${this.props.celeb.pic}`}
          alt={this.props.name}
        ></img>
      </div>
    );
  }
}

export default Card;
