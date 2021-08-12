import React, { Component } from "react";

import windowDimensions from "react-window-dimensions";

import Modal from "./Modal";
import Accordion from "./Accordion";

class Facturacion extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { width } = this.props;

    if (width > 768) {
      return (
        <div id="datos-de-facturacion" className="facturacion-modal">
          <Modal />
        </div>
      );
    }

    return (
      <div id="datos-de-facturacion" className="facturacion-accordion">
        <Accordion />
      </div>
    );
  }
}

export default windowDimensions()(Facturacion);
