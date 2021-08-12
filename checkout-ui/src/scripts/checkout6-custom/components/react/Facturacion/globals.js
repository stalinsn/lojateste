export async function sendCustomData(app, fields) {
  console.log({ app, fields });
  const { orderFormId } = vtexjs.checkout;
  const response = await fetch(
    `/api/checkout/pub/orderForm/${orderFormId}/customData/${app}`,
    {
      method: "PUT",
      body: JSON.stringify(fields),
      headers: {
        accept: "*/*",
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );

  if (response.status === 200) return Promise.resolve();
  else return Promise.reject();
}

export const idOptions = [
  {
    value: "Cédula Física",
    label: "Cédula Física",
    minLength: 9,
    maxLength: 9,
  },
  {
    value: "Cédula Jurídica",
    label: "Cédula Jurídica",
    minLength: 10,
    maxLength: 10,
  },
  { value: "Dimex", label: "Dimex", minLength: 11, maxLength: 12 },
  {
    value: "NIT (Número de Identificación Tributaria)",
    label: "NIT",
    minLength: 10,
    maxLength: 10,
  },
  { value: "Extranjeros", label: "Extranjeros", minLength: -1, maxLength: -1 },
];

export const idFieldLength = (value) => {
  console.log(
    value,
    idOptions.filter((n) => n.value === value)
  );
  const idParams = idOptions.filter((n) => n.value === value);
  if (idParams.length > 0) {
    let max = idParams[0].maxLength;
    let min = idParams[0].minLength;
    if (min <= 0) {
      min = 0;
    }
    if (max <= 0) {
      max = 99;
    }
    console.log({ min, max });
    return { min, max };
  } else return { min: 0, max: 99 };
};
