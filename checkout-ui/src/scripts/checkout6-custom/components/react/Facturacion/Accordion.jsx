import React, { Component } from "react";
import { Collapsible } from "../../../vtex-styleguide";

import { idOptions, idFieldLength } from "./globals";

export default class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      correoElectronico: "",
      nombre: "",
      primerApellido: "",
      segundoApellido: "",
      telefono: "",
      documento: "",
      identificacion: "",
      hasSentCustomData: false,
      identificacionMaxLength: 0,
      identificacionMinLength: 99,
    };
  }

  submitData = async (e) => {
    e.preventDefault();

    const { orderFormId } = vtexjs.checkout;
    const fields = {
      documento: this.state.documento,
      identificacion: this.state.identificacion,
      nombre: this.state.nombre || "-",
      primerApellido: this.state.primerApellido || "-",
      segundoApellido: this.state.segundoApellido || "-",
      telefono: this.state.telefono || "-",
      correoElectronico: this.state.correoElectronico,
    };
    console.log({ fields });
    fetch(`/api/checkout/pub/orderForm/${orderFormId}/customData/facturacion`, {
      method: "PUT",
      body: JSON.stringify(fields),
      headers: {
        accept: "*/*",
        "content-type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.status >= 400) {
          console.error(error);
          alert("Hubo un error al guardar los datos de facturación");
          this.setState({ hasSentCustomData: false });
          return;
        }
        alert("Los datos de facturación fueron guardados");
        this.setState({ isOpen: false, hasSentCustomData: true });
      })
      .catch(() => {
        alert("Hubo un error al guardar los datos de facturación");
        this.setState({ hasSentCustomData: false });
      });
  };

  refreshIdentificacionLengths = (value) => {
    const { min, max } = idFieldLength(value);
    this.setState({
      identificacionMaxLength: max,
      identificacionMinLength: min,
    });
  };

  render() {
    return (
      <>
        <div className="facturacion-accordion-container">
          <Collapsible
            align="right"
            caretColor="muted"
            header={
              <span className="dark-gray fw6">
                {!this.state.hasSentCustomData
                  ? "Añadir datos para factura electrónica"
                  : "Editar datos"}
              </span>
            }
            onClick={(e) => this.setState({ isOpen: e.target.isOpen })}
            isOpen={this.state.isOpen}
          >
            <form onSubmit={this.submitData}>
              <div className="mv6 custom-input">
                <label htmlFor="input-correoElectronico-accordion">
                  <span>Correo*</span>
                  <input
                    required
                    type="email"
                    name="input-correoElectronico-accordion"
                    id="input-correoElectronico-accordion"
                    value={this.state.correoElectronico}
                    onChange={(e) =>
                      this.setState({ correoElectronico: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="mv6 custom-input">
                <label htmlFor="input-name-accordion">
                  <span>Nombre o Razón Social</span>
                  <input
                    type="text"
                    name="input-name-accordion"
                    id="input-name-accordion"
                    value={this.state.nombre}
                    onChange={(e) => this.setState({ nombre: e.target.value })}
                  />
                </label>
              </div>
              <div className="mv6 custom-input">
                <label htmlFor="input-primerApellido-accordion">
                  <span>Primer Apellido</span>
                  <input
                    type="text"
                    name="input-primerApellido-accordion"
                    id="input-primerApellido-accordion"
                    value={this.state.primerApellido}
                    onChange={(e) =>
                      this.setState({ primerApellido: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="mv6 custom-input">
                <label htmlFor="input-segundoApellido-accordion">
                  <span>Segundo Apellido</span>
                  <input
                    type="text"
                    name="segundoApellido"
                    id="input-segundoApellido-accordion"
                    value={this.state.segundoApellido}
                    onChange={(e) =>
                      this.setState({ segundoApellido: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="mv6 custom-input">
                <label htmlFor="input-telefono-accordion">
                  <span>Teléfono</span>
                  <input
                    type="tel"
                    name="Teléfono"
                    id="input-telefono-accordion"
                    value={this.state.telefono}
                    onChange={(e) =>
                      this.setState({ telefono: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="mb6 custom-input">
                <label htmlFor="input-documento-accordion">
                  <span></span>
                  <select
                    required
                    name="input-documento-accordion"
                    id="input-documento-accordion"
                    value={this.state.documento}
                    onChange={({ target: { value } }) => {
                      this.setState({ documento: value });
                      this.refreshIdentificacionLengths(value);
                    }}
                  >
                    <option value="" disabled>
                      Selecciona el tipo de Identificación
                    </option>
                    {idOptions.map((option, i) => {
                      return (
                        <option key={i} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>
              <div className="mv6 custom-input mt8">
                <label htmlFor="input-identificacion-accordion">
                  <span>Identificación</span>
                  <input
                    required
                    type="tel"
                    maxLength={this.state.identificacionMaxLength}
                    minLength={this.state.identificacionMinLength}
                    name="input-identificacion-accordion"
                    id="input-identificacion-accordion"
                    value={this.state.identificacion}
                    onChange={(e) =>
                      this.setState({ identificacion: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="mv6 custom-input mt5">
                <button className="btn primary custom-btn" type="submit">
                  Guardar
                </button>
              </div>
            </form>
          </Collapsible>
        </div>
      </>
    );
  }
}
