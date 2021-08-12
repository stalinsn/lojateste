const SC = 2
const account = 'supermxmcr'
const country = 'CRI'

var loadingModal = document.createElement("div");
loadingModal.setAttribute("class", "map-modal");
loadingModal.setAttribute("id", "loading-modal");
const calculando = 'Un momento por favor, se esta calculando disponibilidad de las tiendas en esta región...'
const initModal = `
<div class="modal-content" style="max-width: 300px; text-align: center;">
  <div class="map-container" id="loading-modal-content" style="">
    <div class="map-row">
      <div id="list" class="loading-list" style="height:auto"></div>
    </div>
  </div>
</div>
`;
const errMessage = 'Se produjo un error, porfavor espere mientras se recarga la pagina...'
loadingModal.innerHTML = initModal
document.body.appendChild(loadingModal);

$(window).on('orderFormUpdated.vtex', async (evt, orderForm) => {
  if (!orderForm.items.length) return
  const _compareItemsSellers = await compareItemsSellers()
  console.log({ _compareItemsSellers })
  if (_compareItemsSellers) return await updateItemsSeller(_compareItemsSellers)
  console.log("FINAL");
})

const getSession = async () => {
  var requestOptions = {
    method: 'GET',
  }

  return await fetch("/api/sessions/?items=*", requestOptions)
    .then(response => response.json())
    .then(data => {
      return data?.namespaces
    })
    .catch(error => console.log('error', error))
}

const getStores = async () => {
  var myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json")

  var graphql = JSON.stringify({
    query:
      'query{\n  listContentWithSchema(blockId: "' + account + '.store-theme@1.x:store-selector", pageContext: {id: "store.home", type: "route"}, template: "*", treePath: "*/$before_header.full/header-layout.desktop/sticky-layout#4-desktop/flex-layout.row#4-desktop/flex-layout.col#category-menu/vtex.menu@2.x:menu#category-menu/store-selector") {\n    content {\n      contentJSON\n    }\n  }\n}',
    variables: {},
  })
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: graphql,
    redirect: "follow",
  }

  return await fetch(
    "/_v/public/graphql/v1?workspace=master",
    requestOptions
  )
    .then((response) => response.json())
    .then(response => response?.data?.listContentWithSchema?.content?.[0]?.contentJSON)
    .then(data => JSON.parse(data))
    .catch((error) => {
      loadingModal.innerHTML = errMessage
      window.location.reload()
      console.error("error", error)
    })
}

const getItemsSellers = () => {
  const itemsSeller = vtexjs?.checkout?.orderForm?.items?.map(({
    seller
  }) => seller).filter((value, index, self) => self.indexOf(value) === index)
  return itemsSeller
}

const getSessionSeller = async () => {
  const session = await getSession()
  const sessionSeller = session?.public?.selectedStore?.value?.sellerId

  return sessionSeller
}

$(window).on('change', (e) => {
  if (e.target.id === "ship-neighborhood") {
    loadingModal.innerHTML = initModal
    document.querySelector(".loading-list").innerText = calculando
    loadingModal.style.display = "block";
  }
});

const getRegionSellers = async () => {
  const postalCode = vtexjs.checkout.orderForm?.shippingData?.address?.postalCode
  console.log({ postalCode });
  if (!postalCode || !/^\d+$/.test(postalCode)) {
    const t = setTimeout(() => {
      console.log("LOGGIN");
      if ($('#edit-address-button')) {
        $('#edit-address-button').trigger('click')
        clearTimeout(t);
      }
    }, 100);
    return
  }

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  }

  return await fetch(`/api/checkout/pub/regions?country=${country}&sc=${SC}&postalCode=${postalCode}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return result?.[0]?.sellers
    })
    .catch((error) => {
      loadingModal.innerHTML = errMessage
      window.location.reload()
      console.error("error", error)
    })
}

const compareRegionSellers = async () => {
  const regionSellers = await getRegionSellers()
  const sessionSeller = await getSessionSeller()

  let regionSeller = regionSellers?.find(({ id }) => id === sessionSeller)

  if (!regionSeller) {
    console.log(regionSellers, regionSellers?.[1]);
    const resp = regionSellers?.[1]?.id ? { type: "MULTIPLE", sellers: regionSellers } : { type: "SINGLE", sellers: [...regionSellers].shift()?.id }
    const stores = await getStores()

    if (resp.type == "MULTIPLE") {
      const filteredStores = stores?.storesArr?.filter(({ sellerId }) => [...regionSellers?.filter(({ id }) => id == sellerId)].shift())

      loadingModal.innerHTML = initModal
      var message = document.createElement("div");
      message.innerText = 'Selecciona una de las tiendas que tienen disponibilidad en tu región.'
      document.querySelector(".loading-list").appendChild(message);

      filteredStores.filter(({ pickupOnly }) => !pickupOnly).map((s, index) => {
        var store = document.createElement("div");
        store.innerHTML = `
              <input type="radio" id="store-${index}" name="selectedStore" class="radio-input">
              <label for="store-${index}" class="store-label">
                <div class="store-title">${s.name} ${s.pickupOnly ? '<span style="font-weight: 100; font-size: smaller;">(Sólo Pickup)</span>' : ''}</div>
                <div class="c-gray elipsis">${s.provincia}, ${s.canton}, ${s.distrito}</div>
                <div class="c-gray elipsis">${s.address}</div>
              </label
            `;
        store.setAttribute("class", "map-list-item");
        store.setAttribute("id", `store-loading-${index}`);
        document.querySelector(".loading-list").appendChild(store);

        document.getElementById(`store-loading-${index}`)
          .addEventListener("click", () => {
            updateSelectedStore(s.sellerId)
            document.querySelector(".loading-list").innerText = calculando
          });
      })
    }
    return resp
  }

  // if (!regionSeller) return [...regionSellers].shift()?.id
  if (regionSeller?.id != sessionSeller) return egionSeller?.id

  closeModal()
  return undefined
}

const compareItemsSellers = async () => {
  const pickupPoints = vtexjs?.checkout?.orderForm?.shippingData?.pickupPoints
  const itemsSellers = await getItemsSellers()
  const sessionSeller = await getSessionSeller()

  if (!pickupPoints.length) {
    const _compareRegionSellers = await compareRegionSellers()
    console.log({ _compareRegionSellers })

    if (_compareRegionSellers) {
      loadingModal.style.display = "block";
      if (_compareRegionSellers?.type == "SINGLE") {
        var message = document.createElement("div");
        loadingModal.innerHTML = initModal
        message.innerText = calculando
        document.querySelector(".loading-list").appendChild(message);
        closeModal()
        return await updateSelectedStore(_compareRegionSellers.sellers)
      }
    }
  }

  if (itemsSellers.length != 1 && sessionSeller) return sessionSeller
  if ([...itemsSellers].shift() != sessionSeller) return sessionSeller

  return undefined
}

const updateItemsSeller = async (seller) => {
  const items = vtexjs.checkout.orderForm.items.map(i => ({
    id: i.id,
    quantity: i.quantity,
    seller
  }))

  vtexjs.checkout.removeAllItems()
  vtexjs.checkout.addToCart(items, null, SC)

  closeModal()
  return vtexjs.checkout.orderForm
}

const updateSelectedStore = async (seller) => {
  const stores = await getStores()
  const newStore = [...stores?.storesArr?.filter(({ sellerId }) => sellerId == seller)].shift()

  if (!newStore) return

  let myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json")

  var raw = JSON.stringify({
    "public": {
      regionId: { value: btoa(`SW#${newStore?.sellerId}`) },
      isPickUp: { value: false },
      "selectedStore": {
        "value": newStore
      }
    }
  })

  var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
  }

  await fetch("/api/sessions/", requestOptions)
    .then(response => response.json())
    .then(() => updateItemsSeller(seller))
    .catch((error) => {
      loadingModal.innerHTML = errMessage
      window.location.reload()
      console.error("error", error)
    })
}

const closeModal = () => {
  const t = setTimeout(() => {
    console.log("removeModal");
    loadingModal.style.display = "none";
    loadingModal.innerHTML = initModal
    clearTimeout(t);
  }, 2000);
}
