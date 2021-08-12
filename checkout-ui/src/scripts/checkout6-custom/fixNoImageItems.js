$(window).on("orderFormUpdated.vtex", function () {
  let removeItems = [];

  vtexjs.checkout.orderForm.items.forEach((item, i) => {
    if (!item.imageUrl) {
      removeItems.push({
        index: i,
        quantity: 0,
      });
    }
  });

  if (removeItems.length >= 1) {
    console.log(`Removing items with index [${removeItems.map(r=>r.index).join()}]`)
    vtexjs.checkout.removeItems(removeItems);
  }
});
