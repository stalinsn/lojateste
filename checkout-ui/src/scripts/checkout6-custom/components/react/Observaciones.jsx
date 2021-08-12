import classNames from "classnames";
import React, { Component } from "react";

import Substitutions from "./Substitutions";

const MODIFY_QTY_DELAY = 1000;

export default class Observaciones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      saved: false,
      errorSaving: false,
      inputTimeout: null,
      criterioSku: "-",
      criterioOrden: "-",
    };
  }

  getOrSetOpenTextField = () => {
    try {
      const { orderForm } = vtexjs.checkout;
      const { openTextField } = orderForm;
      if (openTextField?.value) {
        this.setState({ comment: openTextField.value });
        console.log(({ comment: openTextField.value }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  sendSubstitutionsCustomData = () => {
    const { comment, criterioOrden, criterioSku } = this.state;
    const { orderFormId } = vtexjs.checkout.orderForm;
    // construir objeto
    const substituteItemsArray = {};
    vtexjs.checkout.orderForm.items.forEach((item) => {
      substituteItemsArray[item.id] = {
        substituteType: criterioSku,
        note: comment,
      };
    });
    const payload = {
      skuData: JSON.stringify(substituteItemsArray),
      substituteType: criterioOrden,
    };

    console.log(payload);
    fetch(
      `/api/checkout/pub/orderForm/${orderFormId}/customData/substitutedata`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          accept: "*/*",
          "content-type": "application/json;charset=UTF-8",
        },
      }
    ).then(() => {
      return vtexjs.checkout.getOrderForm();
    });
  };

  componentDidMount() {
    $(window).on("orderFormUpdated.vtex", () => {
      //this.getOrSetOpenTextField();
    });
    this.getOrSetOpenTextField();
  }

  handleInputTimeout = _.debounce(() => {
    clearTimeout(this.state.inputTimeout);

    const newTimeout = setTimeout(() => {
      this.saveComment();
      this.sendSubstitutionsCustomData();
    }, MODIFY_QTY_DELAY);

    this.setState({ inputTimeout: newTimeout });
  }, 500);

  onCommentChange = (e) => {
    this.setState({ comment: e.target.value }, () => {
      const { comment } = this.state;
      if (comment.length < 300) {
        this.handleInputTimeout();
      } else if (comment.length >= 300) {
        this.setState({ comment: comment.slice(0, 300) }, () => {
          this.handleInputTimeout();
        });
      }
    });
  };

  saveComment = () => {
    const { comment } = this.state;
    const { orderFormId } = vtexjs.checkout;
    fetch(
      `/api/checkout/pub/orderForm/${orderFormId}/attachments/openTextField`,
      {
        method: "POST",
        body: JSON.stringify({
          value: comment,
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
        }),
      }
    )
      .then(() => {
        this.setState({ saved: true, errorSaving: false });
      })
      .catch(() => {
        this.setState({ saved: false, errorSaving: true });
      });
  };

  render() {
    return (
      <div
        className="observaciones-wrapper"
        id="custom-component-observaciones"
      >
        <span
          className={classNames("notif", {
            error: this.state.errorSaving,
            saved: this.state.saved,
          })}
        ></span>
        <div className="title">
          ¿Te gustaría dejar un comentario acerca de tu pedido?
        </div>
        <div className="comment-wrapper">
          <textarea
            rows="12"
            cols="50"
            type="text"
            maxLength="300"
            placeholder="300 caracteres"
            value={this.state.comment}
            onChange={this.onCommentChange}
          />
        </div>
        <Substitutions
          onChange={({ criterioSku, criterioOrden }) => {
            this.setState({ criterioSku, criterioOrden }, () => {
              this.sendSubstitutionsCustomData();
            });
          }}
        />
      </div>
    );
  }
}
