$(window).on("load", () => {
  const cupponInterval = setInterval(() => {
    if ($("#cart-link-coupon-add")) {
      $("#cart-link-coupon-add").trigger('click');
      clearInterval(cupponInterval)
    }
  }, 500);
});
