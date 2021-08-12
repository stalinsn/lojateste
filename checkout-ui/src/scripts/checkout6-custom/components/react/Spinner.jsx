import React, { Component } from "react";

export default class Spinner extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className="loader"
        style={{
          width: this.props.size,
          height: this.props.size,
          borderWidth: this.props.borderWidth,
        }}
      />
    );
  }
}
