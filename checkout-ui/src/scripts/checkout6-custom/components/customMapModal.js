var jsGoogleMapAPI = document.createElement("script");
jsGoogleMapAPI.type = "text/javascript";
jsGoogleMapAPI.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&key=AIzaSyBkfKiZpVlezmcE1ywp8T3XYTh9HyuDS5o&callback=initMap`;
//jsGoogleMapAPI.async = true;
document.body.appendChild(jsGoogleMapAPI);
//google.maps.event.addDomListener(window, "load", initMap);

var stores = [];

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var graphql = JSON.stringify({
  query:
    'query{\n  listContentWithSchema(blockId: "supermxmcr.store-theme@1.x:store-selector", pageContext: {id: "store.home", type: "route"}, template: "*", treePath: "*/$before_header.full/header-layout.desktop/sticky-layout#4-desktop/flex-layout.row#4-desktop/flex-layout.col#category-menu/vtex.menu@2.x:menu#category-menu/store-selector") {\n    content {\n      contentJSON\n    }\n  }\n}',
  variables: {},
});
var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: graphql,
  redirect: "follow",
};

fetch(
  "https://supermxmcr.myvtex.com/_v/public/graphql/v1?workspace=master",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => JSON.parse(result))
  .then(({ data }) => data?.listContentWithSchema?.content?.[0]?.contentJSON)
  .then((data) => JSON.parse(data))
  .then((data) => (stores = data?.storesArr))
  .then(() => console.log({ stores }))
  .catch((error) => console.log("error", error));

var mapModal = document.createElement("div");
mapModal.setAttribute("class", "map-modal");
mapModal.setAttribute("id", "map-modal");
mapModal.innerHTML = `
  <div class="modal-content">
    <span class="map-modal-close close">&times;</span>
    <div class="map-container">
      <div class="map-row">
        <div id="list"></div>
        <div id="store-locator-map"></div>
      </div>
      <div class="store-button" id="store-button">
        Seleccionar Punto de Recolección
      </div>
    </div>
  </div>
`;
document.body.appendChild(mapModal);

var map = null;
var infowindow = null;
var selectedStore = null;

function initMap() {
  var latlng = new google.maps.LatLng(10.002607, -84.206038);
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("store-locator-map"), {
    center: latlng,
    zoom: 8,
    panControl: false,
    scaleControl: false,
    streetViewControl: false,
    overviewMapControl: false,
    rotateControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: true,
  });

  stores.map((s, index) => {
    var store = document.createElement("div");

    store.innerHTML = `
          <input type="radio" id="store-${index}" name="selectedStore" class="radio-input">
          <label for="store-${index}" class="store-label">
            <div class="store-title">${s.name}</div>
            <div class="c-gray elipsis">${s.provincia}, ${s.canton}, ${s.distrito}</div>
            <div class="c-gray elipsis">${s.address}</div>
          </label
        `;
    store.setAttribute("class", "map-list-item");
    document.getElementById("list").appendChild(store);

    const marker = new google.maps.Marker({
      position: {
        lat: s.location.lat,
        lng: s.location.lng,
      },
      map,
    });

    marker.addListener("click", () => {
      selectedStore = s;
      infowindow.setContent(`
            <div class="store-title">${s.pickupOnly ? '<span style="font-weight: 100; font-size: smaller;">(Sólo Pickup)</span>' : ''}</div>
            <div class="c-gray elipsis">${s.provincia}, ${s.canton}, ${s.distrito}</div>
            <div class="c-gray elipsis">${s.address}</div>
          `);
      infowindow.open(map, marker);
      document.getElementById(`store-${index}`).checked = true;
      document.getElementById(`store-${index}`).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      map.setZoom(14);
      map.panTo(marker.getPosition());
    });

    store.addEventListener("click", () => {
      selectedStore = s;
      infowindow.setContent(`
            <div class="store-title">${s.pickupOnly ? '<span style="font-weight: 100; font-size: smaller;">(Sólo Pickup)</span>' : ''}</div>
            <div class="c-gray elipsis">${s.provincia}, ${s.canton}, ${s.distrito}</div>
            <div class="c-gray elipsis">${s.address}</div>
          `);
      infowindow.open(map, marker);
      map.setZoom(14);
      map.panTo(marker.getPosition());
    });
  });

  document.getElementById("store-button").addEventListener("click", () => {
    if (!selectedStore) return;

    $("#store-button").addClass("is-loading");
    $("#store-button").append('<div class="loader small"></div>');
    var addressId = new Date().getTime();
    var clientAddress = {
      addressId: addressId,
      addressType: "search",
      city: selectedStore.canton,
      complement: null,
      country: "CRI",
      geoCoordinates: [selectedStore.location.lng, selectedStore.location.lat],
      neighborhood: selectedStore.distrito,
      number: null,
      postalCode: selectedStore.postalCode,
      receiverName: "",
      reference: null,
      state: selectedStore.provincia,
      street: selectedStore.address,
      isDisposable: true,
    };

    var shippingData = vtexjs.checkout.orderForm.shippingData;
    if (shippingData.logisticsInfo.length > 0) {
      for (var j = 0; j < shippingData.logisticsInfo.length; j++) {
        shippingData.logisticsInfo[j].addressId = addressId;
        shippingData.logisticsInfo[j].selectedDeliveryChannel =
          "pickup-in-point";
      }
    }
    shippingData.selectedAddresses = [clientAddress];
    shippingData.availableAddresses = [clientAddress];
    shippingData.address = clientAddress;

    vtexjs.checkout
      .sendAttachment("shippingData", shippingData)
      .then(function (orderForm) {
        $(".vtex-pickup-points-modal-3-x-closeButton").trigger("click");
        $("#store-button").removeClass("is-loading");
        $("#store-button .loader").remove();
        changeDisplayStatus(false);
      });
  });
}

var started = false;

document.onclick = function (e) {
  if (
    e.target.id === "change-pickup-button" ||
    e.target.id === "find-pickups-manualy-button" ||
    e.target.id === "shipping-option-pickup-in-point" ||
    e.target.parentElement.id === "shipping-option-pickup-in-point"
  ) {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(() => {
      if (!started) {
        initMap();
      }
      started = true;
    }, 1000);
    mapModal.style.display = "block";
    changeDisplayStatus(true);
  }
};

var openModalBtn = document.getElementById("change-pickup-button");

var closeModalBtn = document.getElementsByClassName("map-modal-close")[0];

closeModalBtn.onclick = function () {
  mapModal.style.display = "none";
  $(".vtex-pickup-points-modal-3-x-closeButton").trigger("click");
  changeDisplayStatus(false);
};

window.onclick = function (event) {
  if (event.target == mapModal) {
    //mapModal.style.display = "none";
    //$(".vtex-pickup-points-modal-3-x-closeButton").trigger("click");
  }
};

const changeDisplayStatus = (status = false) => {
  if (!!status) {
    $(window).trigger("customEvent.mapModal.displayStatus", true);
  } else {
    $(window).trigger("customEvent.mapModal.displayStatus", false);
  }
};
const ctaWrapperId = "customMapModalCtaWrapper";
const ctaId = "customMapModalCta";
const cta = `
<div id="${ctaWrapperId}" class="customMapModalCtaWrapper">
    <button id="${ctaId}" class="btn btn-primary customMapModalCta">Selecciona tu tienda</button>
</div>
`;
const ctaSibling = ".vtex-omnishipping-1-x-ask.ask-for-geolocation";

$(window).on("customEvent.mapModal.displayStatus", (e, status) => {
  if (!status) {
    console.log("Showing CTA");
    if ($(`#${ctaId}`).length === 0) {
      $(ctaSibling).append(cta);
    }
    mapModal.style.display = "none";
  } else {
    console.log("Hiding CTA");
    $(`#${ctaWrapperId}`).remove();
    mapModal.style.display = "block";
  }
});

$(document).on("click", `#${ctaId}`, () => {
  console.log("show map");
  changeDisplayStatus(true);
});

$(window).on("load", (params) => {});
