export default function formatPrice(price) {
  const result = Number(price) / 100;
  return result
    .toLocaleString("en-US", {
      style: "currency",
      currency: "ARS",
      useGrouping: true,
    })
    .replaceAll(",", "!")
    .replaceAll(".", ",")
    .replaceAll("!", ".")
    .replace("ARS", "₡")
    .replace(",00", "");
}
