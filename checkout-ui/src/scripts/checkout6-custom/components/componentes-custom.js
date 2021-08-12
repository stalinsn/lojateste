import BolsasReutilizables from "./react/BolsasReutilizables";
import Observaciones from "./react/Observaciones";
import Sugerencias from "./react/Sugerencias";

function RenderSugerencias() {
  setInterval(() => {
    try {
      if ($("#sugerencias-de-compra").length === 0) {
        const e = React.createElement;
        window.ReactDOM.render(
          e(Sugerencias),
          document.getElementById("sugerencias-de-compra-container")
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, 200);
}

function renderObservacionesCart() {
  // OBSERVACIONES //
  try {
    if (
      $("#custom-component-observaciones").length === 0 ||
      $("#custom-observaciones-container").length === 0
    ) {
      const domBrother = $(".totalizers.summary-totalizers.cart-totalizers");
      const domContainer = '<div id="custom-observaciones-container"></div>';
      domBrother.before(domContainer);
      const e = React.createElement;
      window.ReactDOM.render(
        e(Observaciones),
        document.getElementById("custom-observaciones-container")
      );
    }
  } catch (error) {
    console.log(error);
  }
}
function renderObservacionesCheckout() {
  // OBSERVACIONES //
  try {
    if (
      $("#custom-component-observaciones").length === 0 ||
      $("#custom-observaciones-container-checkout").length === 0
    ) {
      const domBrother = $(".cart-template.mini-cart");
      const domContainer =
        '<div id="custom-observaciones-container-checkout"></div>';
      domBrother.prepend(domContainer);
      const e = React.createElement;
      window.ReactDOM.render(
        e(Observaciones),
        document.getElementById("custom-observaciones-container-checkout")
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function renderBolsasReutilizables() {
  // BOLSAS REUTILIZABLES //
  try {
    if (
      $("#custom-component-bolsas-reutilizables").length === 0 ||
      $("#custom-bolsas-reutilizables-container").length === 0
    ) {
      const domBrother = $(".totalizers.summary-totalizers.cart-totalizers");
      const domContainer =
        '<div id="custom-bolsas-reutilizables-container"></div>';
      domBrother.before(domContainer);
      const e = React.createElement;
      window.ReactDOM.render(
        e(BolsasReutilizables),
        document.getElementById("custom-bolsas-reutilizables-container")
      );
    }
  } catch (error) {
    console.log(error);
  }
}

$(window).on("load", () => {
  RenderSugerencias();

  setInterval(() => {
    const h = window.location.hash;
    if (h === "#/cart") {
      renderBolsasReutilizables();
      renderObservacionesCart();
    }
    if (h !== "#/cart") {
      renderObservacionesCheckout();
    }
  }, 500);
});
