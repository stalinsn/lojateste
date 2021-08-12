import React, { Component } from "react";
import { NumericStepper, Button } from "../../vtex-styleguide";
import Spinner from "./Spinner";
import classNames from "classnames";

const TIPO_COMPRA_UNIDAD = "unidad";
const TIPO_COMPRA_KG = "kg";

const fontStyle = { fontSize: "13px" };

class WeightedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productOnCart: this.props.inCart,
      tipoCompra:
        this.props.measurementUnit === TIPO_COMPRA_KG
          ? TIPO_COMPRA_KG
          : TIPO_COMPRA_UNIDAD,
      isFakeLoading: true,
    };
  }

  updateQuantity = ({ uniqueId, quantity }) => {
    console.log(uniqueId, quantity);
    const item = vtexjs.checkout.orderForm.items
      .map((item, i) => {
        return {
          uniqueId: item.uniqueId,
          quantity: item.quantity,
          itemIndex: i,
        };
      })
      .filter((item) => item.uniqueId === uniqueId)
      .shift();
    const updateItem = {
      index: item.itemIndex,
      quantity,
    };
    vtexjs.checkout.updateItems([updateItem], null, false).done((orderForm) => {
      this.setState({ productOnCart: orderForm.items[item.itemIndex] });
    });
  };

  onChange = (e) => {
    // console.log("event", e)
    this.updateQuantity({
      uniqueId: this.state.productOnCart?.uniqueId,
      quantity: e.value,
    });
  };

  render() {
    const { tipoCompra, productOnCart } = this.state;
    const { unitMultiplier, measurementUnit } = this.props;
    const showButtonKg = measurementUnit === TIPO_COMPRA_KG;

    return (
      <div className="weighted-button-container">
        <div
          className={classNames(
            `vtex-numeric-stepper-selector ${showButtonKg ? "kg" : "unidad"}`
          )}
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          <NumericStepper
            unitMultiplier={tipoCompra === TIPO_COMPRA_KG ? unitMultiplier : 1}
            suffix={tipoCompra === TIPO_COMPRA_KG ? "kg" : ""}
            value={productOnCart?.quantity}
            minValue={0}
            onChange={(e) => this.onChange(e)}
            block
          />
        </div>
        {showButtonKg ? (
          <div
            className={classNames("flex justify-between", "selectorContainer")}
          >
            <div
              className={classNames("selector", "selectorKg", {
                disabled: tipoCompra === TIPO_COMPRA_KG,
              })}
            >
              <Button
                style={fontStyle}
                className={classNames("tipoCompraButton", "buttonKg", {
                  disabled: tipoCompra === TIPO_COMPRA_KG,
                })}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  this.setState({ tipoCompra: TIPO_COMPRA_KG });
                }}
              >
                Kilogramos
              </Button>
            </div>
            <div
              className={classNames("selector", "selectorUnidad", {
                disabled: tipoCompra === TIPO_COMPRA_UNIDAD,
              })}
            >
              <Button
                style={fontStyle}
                className={classNames("tipoCompraButton", "buttonUnidad", {
                  disabled: tipoCompra === TIPO_COMPRA_UNIDAD,
                })}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  this.setState({ tipoCompra: TIPO_COMPRA_UNIDAD });
                }}
              >
                Unidades
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default class CustomAddToCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      inCart: false,
    };
  }

  componentDidMount() {
    const { product } = this.props;
    const init = () => {
      const { items } = vtexjs.checkout.orderForm;
      const inCart = [
        ...items?.filter(({ id }) =>
          product?.items?.map(({ itemId }) => itemId).includes(id)
        ),
      ].shift();
      this.setState({
        inCart: inCart,
      });
    };
    $(window).on("orderFormUpdated.vtex", () => {
      init();
    });
    init();
  }

  addToCart = (id, quantity = 1, seller = "1") => {
    console.log("Item id is", id);
    const { scopeName } = vtexid.getAuthData();
    const sc = scopeName === "supermxmcr" ? 2 : 1;
        this.setState(
      {
        loading: true,
      },
      () => {
        if (id === undefined || id === null) {
          console.log("null!");
          this.setState({ loading: false });
          return;
        }

        var item = {
          id,
          quantity,
          seller,
        };
        vtexjs.checkout.addToCart([item], null, sc).done((orderForm) => {
          console.log("Item added to cart!");
          this.setState({ loading: false });
        });
      }
    );
  };

  render() {
    const { inCart, loading } = this.state;
    const { itemId, unitMultiplier, measurementUnit } =
      this.props.product.items[0];

    if (loading) {
      return (
        <div className="add-to-cart-button-container">
          <Spinner size={32} borderWidth={4} borderColor="#0075C9" />
        </div>
      );
    }

    return (
      <div className="add-to-cart-button-container">
        {!!inCart ? (
          <WeightedButton
            inCart={inCart}
            unitMultiplier={unitMultiplier}
            measurementUnit={measurementUnit}
          />
        ) : (
          <button
            className="add-to-cart-button"
            onClick={() => {
              this.addToCart(itemId);
            }}
          >
            Agregar al carrito
          </button>
        )}
      </div>
    );
  }
}
