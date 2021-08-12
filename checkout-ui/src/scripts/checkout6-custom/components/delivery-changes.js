$(window).on("load", function () {
  const re = /([01][0-9]|2[0-3]):([0-5][0-9])/gim;

  setInterval(() => {
    if (window.location.hash === "#/shipping") {
      if ($(".vtex-omnishipping-1-x-scheduledDeliveryList").length > 0) {
        {
          $.each(
            $(".vtex-omnishipping-1-x-scheduledDelivery select option"),
            (i, el) => {
              el = $(el);
              const hours = el.text().match(re);
              const text = `Desde las ${hours[0]} a las ${hours[1]}`;
              if (!el.text().includes("Desde las")) {
                el.text(text);
              }
            }
          );
        }
      }
    }
  }, 250);
});

//--------------------------------------------------//

/*import CustomScheduledDelivery from "./react/CustomScheduledDelivery";

import {
  mountReactComponent,
  unmountReactComponent,
} from "./utils/reactComponents";

$(window).on("load", function () {
  setInterval(() => {
    if (window.location.hash === "#/shipping") {
      // No duplicar los elementos, pero permitir que se creen si no existen
      if ($(".vtex-omnishipping-1-x-deliveryGroup-custom").length > 0) {
        return;
      }

      const customScheduledDelivery = `
      <div id="vtex-omnishipping-1-x-deliveryGroup-container"></div>
      `;

      // añadir los elementos
      if ($(".vtex-omnishipping-1-x-deliveryGroup").length == 1) {
        // añadir el contenedor
        $(".vtex-omnishipping-1-x-deliveryGroup").append(
          customScheduledDelivery
        );

        mountReactComponent(
          CustomScheduledDelivery,
          document.getElementById(
            "vtex-omnishipping-1-x-deliveryGroup-container"
          )
        );
      } else {
        try {
          unmountReactComponent(
            document.getElementById(
              "vtex-omnishipping-1-x-deliveryGroup-container"
            )
          );
          $("#vtex-omnishipping-1-x-deliveryGroup-container").remove();
        } catch (error) {}
      }
    } else {
      try {
        unmountReactComponent(
          document.getElementById(
            "vtex-omnishipping-1-x-deliveryGroup-container"
          )
        );
        $("#vtex-omnishipping-1-x-deliveryGroup-container").remove();
      } catch (error) {}
    }

    if (
      $("vtex-omnishipping-1-x-deliveryChannelsOption").hasClass(
        "vtex-omnishipping-1-x-deliveryOptionActive"
      )
    ) {
      unmountReactComponent(
        document.getElementById("vtex-omnishipping-1-x-deliveryGroup-container")
      );
      $("#vtex-omnishipping-1-x-deliveryGroup-container").remove();
    }
  }, 250);
});*/
