function addCheckboxesBeforePayButton() {
  const privacyPolicyCheckboxId = "privacy-policy-accept-checkbox";
  const termsAndConditionsCheckboxId = "terms-and-conditions-accept-checkbox";
  const termsAndConditionsUrl = "/terminos-y-condiciones-de-compra";
  const privacyPolicyUrl = "/aviso-de-privacidad-ecommerce";
  const checkboxes = `<div class="verification-checkboxes">
  <div class="privacy-policy">
    <label for="privacy-policy-accept-checkbox" >
      <input type="checkbox" id="${privacyPolicyCheckboxId}" name="privacy-policy-accept-checkbox" />
      <span class="checkmark"></span>
      <span class="label">Acepto el <a href="${privacyPolicyUrl}" target="_blank">Aviso de Privacidad</a></span>
    </label >
  </div>
  <div class="terms-and-conditions">
    <label for="terms-and-conditions-accept-checkbox">
    <input type="checkbox" id="${termsAndConditionsCheckboxId}" name="terms-and-conditions-accept-checkbox" />
    <span class="checkmark"></span>
    <span class="label">Acepto los <a href="${termsAndConditionsUrl}" target="_blank">Términos y Condiciones</a></span>
    </label>
  </div>
  </div>`;

  const payButtonObserver = () => {
    if (
      window.privacyPolicyAccepted &&
      window.termsAndConditionsAccepted &&
      !window.incompatiblePaymentOptions
    ) {
      $("button#payment-data-submit").prop("disabled", false);
    } else {
      $("button#payment-data-submit").prop("disabled", true);
    }
  };
  setInterval(payButtonObserver, 20);

  const setup = function () {
    if (
      $(".checkout-container").find(".payment-confirmation-wrap").length > 0
    ) {
      $(".payment-confirmation-wrap").prepend(checkboxes);
      $(`#${privacyPolicyCheckboxId}`).prop("checked", false);
      $(`#${termsAndConditionsCheckboxId}`).prop("checked", false);
      window.privacyPolicyAccepted = false;
      window.termsAndConditionsAccepted = false;
      $(`#${privacyPolicyCheckboxId}`).on("change", function () {
        if (this.checked) {
          window.privacyPolicyAccepted = true;
        } else {
          window.privacyPolicyAccepted = false;
        }
      });
      $(`#${termsAndConditionsCheckboxId}`).on("change", function () {
        if (this.checked) {
          window.termsAndConditionsAccepted = true;
        } else {
          window.termsAndConditionsAccepted = false;
        }
      });
      clearInterval(interval);
    }
  };
  const interval = setInterval(setup, 100);
}
$(document).on("ready", function () {
  addCheckboxesBeforePayButton();
});
