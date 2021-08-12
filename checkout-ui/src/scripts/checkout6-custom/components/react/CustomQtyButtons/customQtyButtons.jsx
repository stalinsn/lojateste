import React from "react";

const MODIFY_QTY_DELAY = 1000;

const TIPO_COMPRA_UNIDAD = "unidad";

const TIPO_COMPRA_KG = "kg";

class CustomQtyButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerId: "",
      sku: undefined,
      measurementUnit: undefined,
      unitMultiplier: undefined,
      item: undefined,
      itemIndex: undefined,

      defaultTipoCompra: TIPO_COMPRA_UNIDAD,
      tipoCompraSelected: TIPO_COMPRA_UNIDAD,

      loading: false,

      inputQuantity: 0,
      inputTimeout: null,
    };
  }

  componentDidMount(props) {
    const id = ReactDOM.findDOMNode(this).parentNode.getAttribute("id");
    const sku = ReactDOM.findDOMNode(this).parentNode.getAttribute("data-sku");
    const itemIndex = ReactDOM.findDOMNode(this).parentNode.getAttribute(
      "data-itemIndex"
    );

    const item = vtexjs.checkout.orderForm.items[itemIndex];

    const { measurementUnit, unitMultiplier } = item;

    const defaultTipoCompra =
      measurementUnit.toLowerCase() === "kg"
        ? TIPO_COMPRA_KG
        : TIPO_COMPRA_UNIDAD;

    this.setState({
      containerId: id,
      sku,
      measurementUnit,
      unitMultiplier,
      item,
      itemIndex,
      defaultTipoCompra,
      tipoCompraSelected: defaultTipoCompra,
      inputQuantity:
        defaultTipoCompra === TIPO_COMPRA_UNIDAD
          ? item?.quantity
          : item?.quantity * unitMultiplier,
    });
  }

  handleInputQuantityChange = (e) => {
    let value = Number(e.target.value);
    if (value < 0) value = 0;

    if (isNaN(value)) value = this.state.inputQuantity;

    this.setState({ inputQuantity: value });
  };

  handleInputQuantityBlur = (e) => {
    let value = Number(e.target.value);
    if (value < 0) value = 0;

    if (isNaN(value)) value = this.state.inputQuantity;

    this.setState({ inputQuantity: value });

    this.updateQty();
  };

  // arg should be boolean, if true, add, else, remove
  handleStepperClick = (add) => {
    const { inputQuantity, unitMultiplier, tipoCompraSelected } = this.state;
    let addend = tipoCompraSelected === TIPO_COMPRA_KG ? unitMultiplier : 1;
    if (!add) addend = addend * -1;
    let value = Number(inputQuantity) + addend;
    if (value < 0) value = 0;

    this.setState({ inputQuantity: value }, () => {
      this.updateQty();
    });
  };

  selectKg = () => {
    const { tipoCompraSelected, inputQuantity, unitMultiplier } = this.state;
    if (tipoCompraSelected === TIPO_COMPRA_KG) return;
    this.setState({
      tipoCompraSelected: TIPO_COMPRA_KG,
      inputQuantity: inputQuantity * unitMultiplier,
    });
  };

  selectUnidades = () => {
    const { tipoCompraSelected, inputQuantity, unitMultiplier } = this.state;
    if (tipoCompraSelected === TIPO_COMPRA_UNIDAD) return;
    this.setState({
      tipoCompraSelected: TIPO_COMPRA_UNIDAD,
      inputQuantity: Math.round(inputQuantity / unitMultiplier),
    });
  };

  updateQty = _.debounce(() => {
    const {
      tipoCompraSelected,
      unitMultiplier,
      inputQuantity,
      itemIndex,
      sku,
      item: oldItem,
    } = this.state;

    let value =
      tipoCompraSelected === TIPO_COMPRA_UNIDAD
        ? inputQuantity
        : Math.round(inputQuantity / unitMultiplier);

    this.setState(
      { loading: true, item: { ...oldItem, quantity: value } },
      () => {
        if (value === 0) {
          this.setState({ loading: false });
          return;
        }

        vtexjs.checkout
          .getOrderForm()
          .then((orderForm) => {
            const updateItem = {
              index: itemIndex,
              quantity: value,
            };
            return vtexjs.checkout.updateItems([updateItem], null, false);
          })
          .done((orderForm) => {
            const item = orderForm.items.filter((i) => i.id === sku)[0];
            this.setState({
              item,
              loading: false,
            });
          });
      }
    );
  }, 500);

  handleInputTimeout = () => {
    clearTimeout(this.state.inputTimeout);

    const newTimeout = setTimeout(() => {
      this.updateQty();
    }, MODIFY_QTY_DELAY);

    this.setState({ inputTimeout: newTimeout });
  };

  render() {
    const { item, tipoCompraSelected, loading, unitMultiplier } = this.state;

    const value =
      tipoCompraSelected === TIPO_COMPRA_UNIDAD
        ? item?.quantity
        : item?.quantity * unitMultiplier;

    const isQtyMinusInputDisabled = () => {
      return value === 0;
    };

    //console.log(loading)

    if (loading) {
      return (
        <div>
          <i className="icon icon-spinner icon-spin"></i>
        </div>
      );
    }

    if (item?.sellingPrice === 0) {
      return <div>{item.quantity}un. Gratis</div>;
    }

    return (
      <>
        <div className="qty-content">
          <button
            disabled={isQtyMinusInputDisabled()}
            className="qty-resta"
            onClick={() => {
              this.handleStepperClick(false);
            }}
          >
            <i className="icon icon-minus-sign"></i>
          </button>
          <div className="input-quantity">
            <input
              type="telephone"
              value={this.state.inputQuantity}
              onChange={this.handleInputQuantityChange}
              onBlur={this.handleInputQuantityBlur}
              onKeyUp={this.handleInputTimeout}
            />
            {this.state.tipoCompraSelected === TIPO_COMPRA_KG && (
              <span className="suffix">kg</span>
            )}
          </div>

          <button
            className="qty-suma"
            onClick={() => {
              this.handleStepperClick(true);
            }}
          >
            <i className="icon icon-plus-sign"></i>
          </button>
        </div>
        <div className="type-selector">
          <button
            className="btn custom-btn secondary btn-kg"
            disabled={tipoCompraSelected === TIPO_COMPRA_KG}
            onClick={this.selectKg}
          >
            Kg
          </button>
          <button
            className="btn custom-btn secondary btn-unid"
            disabled={tipoCompraSelected === TIPO_COMPRA_UNIDAD}
            onClick={this.selectUnidades}
          >
            Unidades
          </button>
        </div>
      </>
    );
  }
}

export default <CustomQtyButtons />;
