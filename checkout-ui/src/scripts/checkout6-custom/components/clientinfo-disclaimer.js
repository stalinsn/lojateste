$(window).on("load", function () {
  const termsAndConditionsUrl = "/terminos-y-condiciones-de-compra";
  const privacyPolicyUrl = "/aviso-de-privacidad-ecommerce";
  setInterval(() => {
    if ($("#client-profile-data p.newsletter").length > 0) {
      const disclaimer = `
        <p class="disclaimer">
        Al registrarte, aceptas el
        <a href="${privacyPolicyUrl}" target="_blank" rel="noopener noreferrer">Aviso de Privacidad</a> y
        los <a href="${termsAndConditionsUrl}" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a> que puedes consultar aquí, así como el envío de noticias y promociones exclusivas de Masxmenos.
        <p>
        `;

      if ($("p.disclaimer").length == 0) {
        $("#client-profile-data p.newsletter").after(disclaimer);
      }
    }
  }, 500);
});

//Al registrarte, aceptas el Aviso de Privacidad y los Términos y Condiciones que puedes consultar aquí, así como el envío de noticias y promociones exclusivas de Masxmenos.
