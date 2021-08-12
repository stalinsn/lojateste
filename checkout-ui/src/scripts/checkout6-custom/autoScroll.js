window.addEventListener(
  "hashchange",
  function (e) {
    if (
      //e.oldURL.includes("#/cart") &&
      window.location.hash === "#/profile" ||
      window.location.hash === "#/shipping" ||
      window.location.hash === "#/payment"
    ) {
      window.scroll(0, 0);
    }
  },
  false
);
