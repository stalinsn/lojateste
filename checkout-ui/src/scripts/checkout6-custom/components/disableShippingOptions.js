const shippingOptions = require("./disabled-shipping-options.json");

function disableShippingOptions() {
  if (window.location.hash !== "#/shipping") {
    return;
  }

  try {
    shippingOptions["ship-state"].forEach((shipState) => {
      const stateOption = $(
        `select#ship-state option[value="${shipState.value}"]`
      );
      if (shipState.disabled && stateOption) {
        /*console.log(
          "disable",
          `select#ship-state option[value="${shipState.value}"]`,
          stateOption
        );*/
        $(stateOption).prop("disabled", true);
        $(stateOption).css("display", "none");
      }
      shipState["ship-city"].forEach((shipCity) => {
        const cityOption = $(
          `select#ship-city option[value="${shipCity.value}"]`
        );
        if (shipCity.disabled && cityOption) {
          /*console.log(
              "disable",
              `select#ship-city option[value="${shipCity.value}"]`,
              cityOption
            );*/
          $(cityOption).prop("disabled", true);
          $(cityOption).css("display", "none");
        }

        shipCity["ship-neighborhood"].forEach((shipNeighborhood) => {
          const value = `${shipNeighborhood.label}___${shipNeighborhood.postalCode}`;
          const neighborhoodOption = $(
            `select#ship-neighborhood option[value="${value}"]`
          );
          if (shipNeighborhood.disabled && neighborhoodOption) {
            $(neighborhoodOption).prop("disabled", true);
            $(neighborhoodOption).css("display", "none");
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
}

$(window).on("load", function () {
  disableShippingOptions();
  setInterval(() => {
    try {
      disableShippingOptions();
    } catch (error) {
      console.error(error);
    }
  }, 1000);
});

$(window).on("orderFormUpdated.vtex", function () {
  disableShippingOptions();
});
