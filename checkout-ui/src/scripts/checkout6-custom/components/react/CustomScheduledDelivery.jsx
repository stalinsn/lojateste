import React, { Component } from "react";

export default class CustomScheduledDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logisticsInfo: null,
      locale: "es-CR",
      selectedDay: null,
      deliveryDays: [],
      selectedDeliveryOption: null,
    };
  }

  componentDidMount() {
    const logisticsInfo =
      vtexjs.checkout.orderForm.shippingData.logisticsInfo[0];

    console.log(logisticsInfo);

    const sla = logisticsInfo.slas.filter(
      (sla) => sla.deliveryChannel == "delivery"
    )[0];

    console.log(logisticsInfo);

    const { availableDeliveryWindows } = sla;

    console.log(availableDeliveryWindows);

    const deliveryGroups = _.groupBy(availableDeliveryWindows, function (e) {
      return `${new Date(
        e.startDateUtc
      ).getFullYear()}/${new Date(e.startDateUtc).getMonth() + 1}/${new Date(e.startDateUtc).getDate()}`;
    });

    const deliveryDays = _.map(deliveryGroups, function (group, day) {
      return {
        day: day,
        options: group,
      };
    });

    console.log(deliveryDays);

    this.setState({
      logisticsInfo,
      sla,
      availableDeliveryWindows,
      deliveryDays,
    });
  }

  handleSelectedDay = (e) => {
    console.log(e.target.value);
    this.setState({
      selectedDay: e.target.value,
    });
  };

  handleSelectedOption = (e) => {
    console.log(e.target.value);
    this.setState({
      selectedDeliveryOption: e.target.value,
    });

    const { deliveryDays } = this.state;
    console.log(deliveryDays);
    const _date = new Date(e.target.value);
    const selectedDeliveryDay = deliveryDays.filter(
      (d) =>
        d.day ===
        `${new Date(_date).getFullYear()}/${
          new Date(_date).getMonth() + 1
        }/${new Date(_date).getDate()}`
    )[0];

    console.log(selectedDeliveryDay);
    const selectedDeliveryWindow = selectedDeliveryDay.options.filter(
      (o) => o.startDateUtc === e.target.value
    )[0];
    const { shippingData, items } = vtexjs.checkout.orderForm;
    const { addressId } = shippingData.address;
    const payload = {
      logisticsInfo: items.map((item, i) => {
        return {
          deliveryWindow: selectedDeliveryWindow,
          addressId: addressId,
          itemIndex: i,
          selectedDeliveryChannel: "delivery",
          selectedSla: "Entrega a domicilio",
        };
      }),
      selectedAddresses: shippingData.selectedAddresses,
      clearAddressIfPostalCodeNotFound: false,
      expectedOrderFormSections: [
        "items",
        "totalizers",
        "clientProfileData",
        "shippingData",
        "paymentData",
        "sellers",
        "messages",
        "marketingData",
        "clientPreferencesData",
        "storePreferencesData",
        "giftRegistryData",
        "ratesAndBenefitsData",
        "openTextField",
        "commercialConditionData",
        "customData",
      ],
    };

    console.log(payload);
    const orderFormId = vtexjs.checkout.orderFormId;
    fetch(
      `/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`,
      { method: "POST", body: JSON.stringify(payload) }
    ).then((res) => {
      vtexjs.checkout.getOrderForm();
    });
  };

  render() {
    const { selectedDay, deliveryDays } = this.state;

    return (
      <div className="vtex-omnishipping-1-x-deliveryGroup-custom">
        <div>
          <h2>Elige la fecha y hora de entrega</h2>
        </div>
        <div>
          <select value={selectedDay} onChange={this.handleSelectedDay}>
            <option value="" selected>
              Selecciona el día para la entrega
            </option>
            {deliveryDays.map(({ day, options }) => {
              const _date = new Date(options[0].startDateUtc);
              return (
                <option key={day} value={day}>
                  {_date.toLocaleDateString("es-CR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </option>
              );
            })}
          </select>
        </div>
        {selectedDay && (
          <div>
            <h3>Horario</h3>
            <form action="submit">
              {deliveryDays
                .filter((d) => d.day === selectedDay)[0]
                .options.map((option) => {
                  const startDate = new Date(option.startDateUtc);
                  const endDate = new Date(option.endDateUtc);
                  const labelStart = `${Intl.DateTimeFormat("es-CR", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    timeZone: "UTC",
                  }).format(startDate)}`;
                  const labelEnd = `${Intl.DateTimeFormat("es-CR", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    timeZone: "UTC",
                  }).format(endDate)}`;
                  return (
                    <label htmlFor={option.startDateUtc}>
                      <input
                        type="radio"
                        name="deliveryOptions"
                        id={option.startDateUtc}
                        value={option.startDateUtc}
                        key={option.startDateUtc}
                        onChange={this.handleSelectedOption}
                      />
                      <span>
                        Desde las <span>{labelStart}</span> hasta las{" "}
                        <span>{labelEnd}</span>
                      </span>
                    </label>
                  );
                })}
            </form>
          </div>
        )}
      </div>
    );
  }
}
