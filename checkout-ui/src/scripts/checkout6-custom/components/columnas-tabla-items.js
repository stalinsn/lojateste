/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
import CustomQtyButtons from "./react/CustomQtyButtons/customQtyButtons";

async function addCustomQtyButtons() {
  var x = 0;
  const intervalID = setInterval(() => {
    if (!window.ReactDOM) return;

    //custom qty button
    $.each($("table.cart-items tr.product-item"), (i, el) => {
      const { items } = vtexjs.checkout.orderForm;
      // const { id, measurementUnit } = items[i];
      const id = items?.[i]?.id
      const measurementUnit = items?.[i]?.measurementUnit

      const elementId = `qty-${id}-${i}`;

      if (measurementUnit === "kg") {
        $(el).find("td.quantity").html("");
        $(el)
          .find("td.quantity")
          .html(
            `<div id="${elementId}" data-sku="${id}" data-itemIndex="${i}" class="custom-qty-selector"></div>`
          );

        window.ReactDOM.render(
          CustomQtyButtons,
          document.getElementById(elementId)
        );
      }
    });

    if (++x === 10) {
      window.clearInterval(intervalID);
    }
  }, 500);
}

$(window).on("orderFormUpdated.vtex", function (orderForm) {
  //$('.table.cart-items th').attr('colspan', '1')
  addCustomQtyButtons();
});
