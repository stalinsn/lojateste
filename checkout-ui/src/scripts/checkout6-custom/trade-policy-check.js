const setOrderFormSC = async (sc) => {
  var requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };

  await vtexjs.checkout.removeAllItems()

  await fetch(`/api/checkout/pub/orderform/?sc=2`, requestOptions)
    .then((response) => response.text())
    //.then((result) => console.log('trade-policy-check: ',result))
    .catch((error) => console.log("trade-policy-check: error", error));

  console.log("trade-policy-check: setOrderFormSC");
};

const setSessionSC = async (sc) => {
  var raw = JSON.stringify({
    public: {
      sc: {
        value: sc,
      },
    },
  });

  var requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: raw,
  };

  await fetch("/api/sessions/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  console.log("trade-policy-check: setSessionSC");
};

const init = async () => {
  if (vtexjs.checkout.orderForm.salesChannel != 2) {
    await setOrderFormSC(2);
    await setSessionSC(2);

    console.log("trade-policy-check: redirect!!!");
    window.location.reload();

    console.log("trade-policy-check: SC=1");
  } else {
    console.log("trade-policy-check: SC=2");
  }
};

$(window).on("vtexjsReady", function () {
  setTimeout(() => {
    if (window.vtexjs.checkout) {
      init();
    }
  }, 500);
});
