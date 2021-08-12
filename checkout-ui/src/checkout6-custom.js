/* eslint-disable */
// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.

console.log("Template by Franco Giordani");

//import "./scripts/checkout6-custom/trade-policy-check";

import "./scripts/checkout6-custom/fixNoImageItems.js";
import "./scripts/checkout6-custom/autoScroll.js";

import "./scripts/checkout6-custom/scriptCarlos.js";
import "./scripts/checkout6-custom/components/facturacion";
import "./scripts/checkout6-custom/components/columnas-tabla-items.js";
import "./scripts/checkout6-custom/components/componentes-custom";
import "./scripts/checkout6-custom/components/delivery-changes";
import "./scripts/checkout6-custom/components/clientinfo-disclaimer";
import "./scripts/checkout6-custom/components/activateCouponForm";
import "./scripts/checkout6-custom/components/hideApartirDe";
import "./scripts/checkout6-custom/components/customMapModal";
import "./scripts/checkout6-custom/components/priceThousandSeparator";
//import "./scripts/checkout6-custom/components/customShipping";
import "./scripts/checkout6-custom/components/disableShippingOptions";

$(window).on("load", function () {
  const waitForReact = setInterval(() => {
    const { React, ReactDOM } = window;
    if (React != undefined && ReactDOM != undefined) {
      clearInterval(waitForReact);
      console.log("react ready");
      $(window).trigger("reactReady");
    }
  }, 25);
});

$(window).on("load", function () {
  const waitForVtexJs = setInterval(() => {
    if (window.vtexjs) {
      clearInterval(waitForVtexJs);
      console.log("vtexjs ready");
      $(window).trigger("vtexjsReady");
    }
  }, 25);
});
