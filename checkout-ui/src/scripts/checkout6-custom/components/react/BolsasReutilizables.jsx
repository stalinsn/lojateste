import React, { Component } from "react";

const BOLSAS_REUTILIZABLES_ID = "3060";

export default class BolsasReutilizables extends Component {
  constructor() {
    super();
    this.state = {
      noNecesita: false,
      siNecesita: false,
    };
  }

  onClickAccept = () => {
    const { scopeName } = vtexid.getAuthData();
    const sc = scopeName === "supermxmcr" ? 2 : 1;
    console.log("Necesita bolsas");
    var item = {
      id: BOLSAS_REUTILIZABLES_ID,
      quantity: 1,
      seller: "1",
    };
    this.setState({
      noNecesita: false,
      siNecesita: true,
    });
    console.log(item);
    vtexjs.checkout.getOrderForm().then((orderForm) => {
      return vtexjs.checkout.addToCart([item], null, sc);
    });
  };

  onClickDeny = () => {
    console.log("No necesita bolsas");
    this.setState({
      noNecesita: true,
      siNecesita: false,
    });
    vtexjs.checkout.getOrderForm().then((orderForm) => {
      let bolsasItemIndex = 0;
      let hasBolsas = false;

      for (let i = 0; i < orderForm.items.length; i++) {
        const item = orderForm.items[i];
        if (item.id === BOLSAS_REUTILIZABLES_ID) {
          bolsasItemIndex = i;
          hasBolsas = true;
        }
      }
      if (hasBolsas) {
        //removeItem
        var itemsToRemove = [
          {
            index: bolsasItemIndex,
            quantity: 0,
          },
        ];
        return vtexjs.checkout.removeItems(itemsToRemove);
      }
    });
  };

  render() {
    const { noNecesita, siNecesita } = this.state;
    const btnNoActive = noNecesita && !siNecesita;
    const btnSiActive = !noNecesita && siNecesita;

    return (
      <div
        className="bolsas-reutilizables-wrapper"
        id="custom-component-bolsas-reutilizables"
      >
        <div className="title">¿Necesitas bolsas reutilizables?</div>
        <div className="buttons-container">
          <div className="button-wrapper">
            <button
              className={`button-bolsasreutilizables button-bolsasreutilizables-no ${
                btnNoActive ? "active" : ""
              }`}
              onClick={this.onClickDeny}
            >
              No
            </button>
          </div>
          <div className="button-wrapper">
            <button
              className={`button-bolsasreutilizables button-bolsasreutilizables-si ${
                btnSiActive ? "active" : ""
              }`}
              onClick={this.onClickAccept}
            >
              Sí
            </button>
          </div>
        </div>
      </div>
    );
  }
}
