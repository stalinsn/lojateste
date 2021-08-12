var re = /([0-9]{1,3}\s?)+/g;

const replaceWithDots = (el) => {
  const text = $(el).text();
  const price = text.match(re);
  if (price) {
    let withDots = price
      .toString()
      .replaceAll(/\u00a0/g, ".")
      .replaceAll(",", ".");
    if (withDots.slice(withDots.length - 3, withDots.length) === ".00") {
      withDots = withDots.slice(0, withDots.length - 3);
    }
    $(el).text("₡ " + withDots);
  }
};

const forAllElements = (selector) => {
  $.each($(selector), (i, el) => {
    replaceWithDots(el);
  });
};

const trigger = () => {
  forAllElements("td.monetary");
  forAllElements(".old-product-price");
  forAllElements(".new-product-price");
  forAllElements(".total-selling-price");
  forAllElements(".price");
};

$(window).on("load", function () {
  setInterval(() => {
    trigger();
  }, 750);
});
