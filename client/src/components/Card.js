import React from "react";
import "./Card.css";

class Card extends React.Component {
  render() {
    return (
      <div id={this.props.id} tabIndex={this.props.tabIndex} className="card" 
        onClick={this.props.handleClick} onKeyPress={this.props.handleKeyPress} >
        <h2>{this.props.celeb.name}</h2>
        <img
          src={`./celeb_pics/${this.props.celeb.pic}`}
          alt={this.props.celeb.name}
        ></img>
      </div>
    );
  }
}

export default Card;
