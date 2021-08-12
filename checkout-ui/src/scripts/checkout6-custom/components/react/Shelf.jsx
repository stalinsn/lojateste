import React, { Component } from "react";
import CustomAddToCart from "./CustomAddToCart";

import formatPrice from "./utils/formatPrice";

const IMAGE_SIZE = 250;

export default class Shelf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      inCart: false,
    };
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
          this.setState({ loading: false, inCart: true });
        });
      }
    );
  };

  render() {
    const { item } = this.props;
    const { loading, inCart } = this.state;
    const { productName, brand, link } = item;

    const { images, itemId } = item.items[0];

    const img = images ? images[0] : {};

    const commertialOffer = item.items[0].sellers[0].commertialOffer;

    const { ListPrice, Price, Teasers } = commertialOffer;

    return (
      <div data-productid={itemId} className="upsell-shelf">
        <div className="product-top">
          <div className="product-image-container">
            <a href={link}>
              {/*<Slider {...sliderSettings}>
                {images.map((img) => {
                  return (

                  );
                })}
            </Slider>*/}
              {images ? (
                <img
                  key={img.imageId}
                  data-image-id={img.imageId}
                  src={`/arquivos/ids/${img.imageId}-${IMAGE_SIZE}-${IMAGE_SIZE}/${img.imageText}.jpg`}
                  width={144}
                  height={144}
                  alt={img.imageText}
                  className="product-image"
                />
              ) : (
                <img
                  key="null"
                  data-image-id={null}
                  src={`/arquivos/ids/${null}-${IMAGE_SIZE}-${IMAGE_SIZE}/${null}.jpg`}
                  width={144}
                  height={144}
                  alt={productName}
                  className="product-image"
                ></img>
              )}
            </a>
          </div>
          <div className="discounts-container">{Teasers}</div>
          <div className="wishlist-container"></div>
        </div>
        <div className="product-name">{productName}</div>
        <div className="product-brand">{brand}</div>
        <div className="product-price-container">
          <div className="product-list-price">
            {ListPrice !== Price
              ? formatPrice(ListPrice * 100).replace(/(,\d\d)/gi, "")
              : ""}
          </div>
          <div className="product-selling-price">
            {formatPrice(Price * 100).replace(/(,\d\d)/gi, "")}
          </div>
        </div>

        <CustomAddToCart product={item} />

        <div className="quantity-box"></div>
        {ListPrice !== Price && (
          <span className="savings">
            <span className="savings-wrapper">
              <span className="savings-pct">
                -{((1 - Price / ListPrice) * 100).toFixed(0)}%
              </span>
            </span>
          </span>
        )}
      </div>
    );
  }
}
// ListPrice !== Price &&
// -{((1 - Price / ListPrice)*100).toFixed(0)}%
