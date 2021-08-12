import React, { Component } from "react";

import substitutionOptions from "./substitutionOptions";

export default class Substitutions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      substitution: substitutionOptions[0].criterioOrden,
    };
  }

  setSubstitutionType = () => {
    const { customData } = vtexjs.checkout.orderForm;
    if (customData === null) return;

    if (customData.customApps) {
      const { customApps } = customData;
      const substituteDataCustomApp = customApps.filter(
        (ca) => ca.id === "substitutedata"
      );
      if (substituteDataCustomApp.length > 0) {
        const substituteType = substituteDataCustomApp[0].fields.substituteType;
        this.setState({ substitution: substituteType });
      }
      return;
    }
  };

  componentDidMount() {
    $(window).on("orderFormUpdated.vtex", () => {
      console.log("substitution orderFormUpdated");
      this.setSubstitutionType();
    });
    this.setSubstitutionType();
  }

  render() {
    return (
      <div className="substitutions-wrapper">
        <div className="content">
          <label>
            <span>
              Si alguno de tus productos no estuviera disponible, ¿cómo te
              gustaría que procedamos?
            </span>
            <select
              name="substitutions"
              id="substitutions"
              defaultValue={this.state.substitution}
              value={this.state.substitution}
              onChange={({ target: { value } }) => {
                this.setState({ substitution: value });
                let criterioSku = substitutionOptions.filter(
                  (s) => s.criterioOrden === value
                )[0].criterioSku;
                this.props.onChange({ criterioSku, criterioOrden: value });
              }}
            >
              {substitutionOptions.map((option, i) => {
                return (
                  <option
                    key={option.criterioOrden}
                    value={option.criterioOrden}
                  >
                    {option.description}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>
    );
  }
}
