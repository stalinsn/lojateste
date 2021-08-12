/* eslint-disable */
"use strict";
import Facturacion from "./react/Facturacion/Facturacion.jsx";

$(window).on("reactReady", function () {
  let counter = 0;
  const waitForContainer = setInterval(() => {
    if (window.location.hash !== "#/payment") return;

    const { React } = window;
    const domBrother = $(
      "#payment-data .payment-body .accordion-inner .box-step-content form.form-step .payment-group"
    );
    if (React && domBrother.length > 0) {
      if ($("#datos-de-facturacion").length === 0) {
        console.log("\x1b[42m Datos de Facturacion");
        const domContainer = '<div id="custom-datos-facturacion"></div>';

        domBrother.before(domContainer);

        const e = React.createElement;
        window.ReactDOM.render(
          e(Facturacion),
          document.getElementById("custom-datos-facturacion")
        );
      }
    }
  }, 200);
});
