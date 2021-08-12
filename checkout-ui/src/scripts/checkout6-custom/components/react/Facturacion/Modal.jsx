import React, { Component } from "react";

import { Modal } from "../../../vtex-styleguide";

import { idOptions, idFieldLength } from "./globals";

export default class FacturacionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      correoElectronico: undefined,
      nombre: undefined,
      primerApellido: undefined,
      segundoApellido: undefined,
      telefono: undefined,
      documento: undefined,
      identificacion: undefined,
      hasSentCustomData: false,
      identificacionMaxLength: 0,
      identificacionMinLength: 99,
    };
  }

  handleModalToggle = (e) => {
    e.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  };

  submitData = (e) => {
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
    console.debug({ fields });

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
        console.debug(response);
        alert("Los datos de facturación fueron guardados");
        this.setState({ isOpen: !this.state.isOpen, hasSentCustomData: true });
      })
      .catch((error) => {
        console.error(error);
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
        <div className="cta factura">¿Deseas factura electrónica?</div>
        <button
          className="btn secondary custom-btn"
          onClick={this.handleModalToggle}
        >
          {!this.state.hasSentCustomData
            ? "Añadir datos para factura electrónica"
            : "Editar datos"}
        </button>
         
        <Modal
          centered
          isOpen={this.state.isOpen}
          onClose={this.handleModalToggle}
        >
          <div className="facturacion-modal-container">
            <div className="title">
              Completa tus datos para factura electrónica
            </div>
            <form onSubmit={this.submitData}>
              <div className="flex items-center justify-around">
                <div className="mb5 w-50 mh6 custom-input">
                  <label htmlFor="input-correoElectronico-modal">
                    <span>Correo*</span>
                    <input
                      type="email"
                      required
                      name="correoElectronico-modal"
                      id="input-correoElectronico-modal"
                      value={this.state.correoElectronico}
                      onChange={(e) =>
                        this.setState({ correoElectronico: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="mb5 w-50 mh6 custom-input">
                  <label htmlFor="input-telefono-modal">
                    <span className="">Teléfono</span>
                    <input
                      type="telephone"
                      name="telefono-modal"
                      id="input-telefono-modal"
                      value={this.state.telefono}
                      onChange={(e) =>
                        this.setState({ telefono: e.target.value })
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-around">
                <div className="mb5 w-50 mh6 custom-input">
                  <label htmlFor="input-nombre-modal">
                    <span>Nombre o Razón Social</span>
                    <input
                      type="text"
                      name="nombre-modal"
                      id="input-nombre-modal"
                      value={this.state.nombre}
                      onChange={(e) =>
                        this.setState({ nombre: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="mb5 w-50 mh6 custom-input">
                  <label htmlFor="input-documento-modal">
                    <span>Tipo de Identificación*</span>
                    <select
                      required
                      name="documento-modal"
                      id="input-documento-modal"
                      value={this.state.documento}
                      defaultValue=""
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
              </div>
              <div className="flex items-center justify-around">
                <div className="mb5 w-50 mh6 custom-input">
                  <label htmlFor="input-primerApellido-modal">
                    <span>Primer Apellido</span>
                    <input
                      name="primerApellido"
                      id="input-primerApellido-modal"
                      value={this.state.primerApellido}
                      onChange={(e) =>
                        this.setState({ primerApellido: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="mb5 w-50 mh6 custom-input">
                  <label htmlFor="input-identificacion-modal">
                    <span>Identificación</span>
                    <input
                      required
                      name="identificacion-modal"
                      id="input-identificacion-modal"
                      type="tel"
                      maxLength={this.state.identificacionMaxLength}
                      minLength={this.state.identificacionMinLength}
                      value={this.state.passwordValue}
                      onChange={(e) =>
                        this.setState({ identificacion: e.target.value })
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-around">
                <div className="mb5 w-50 mh6 custom-input">
                  <label htmlFor="input-segundoApellido-modal">
                    <span>Segundo Apellido</span>
                    <input
                      type="text"
                      name="segundoApellido-modal"
                      id="input-segundoApellido-modal"
                      value={this.state.segundoApellido}
                      onChange={(e) =>
                        this.setState({ segundoApellido: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="mb5 w-50 mh6 custom-input">
                  <button className="btn primary custom-btn" type="submit">
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      </>
    );
  }
}
