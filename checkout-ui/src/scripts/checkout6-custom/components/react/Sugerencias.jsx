import React, { Component } from "react";
import Slider from "react-slick";
import classNames from "classnames";

import Shelf from "./Shelf";

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 3000,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        centerMode: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        dots: false,
      },
    },
  ],
};

const configsShelf = {
  idCollection: "137",
  currency: "CRI",
  shelfOrdenation: 3,
};

var shelfOrdenation;
switch (configsShelf.shelfOrdenation) {
  case 1:
    shelfOrdenation = "O=OrderByPriceDESC";
    break;
  case 2:
    shelfOrdenation = "O=OrderByPriceASC";
    break;
  case 3:
    shelfOrdenation = "O=OrderByTopSaleDESC";
    break;
  case 4:
    shelfOrdenation = "O=OrderByReleaseDateDESC";
    break;
  case 5:
    shelfOrdenation = "O=OrderByBestDiscountDESC";
    break;
  case 6:
    shelfOrdenation = "O=OrderByReviewRateDESC";
    break;

  default:
    break;
}

const filterProducts = (arr) => {
  return arr.filter(
    (i) =>
      i.items[0]?.sellers[0]?.commertialOffer?.IsAvailable &&
      i.items[0]?.sellers[0]?.commertialOffer?.AvailableQuantity > 0
  );
};

export default class Sugerencias extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: false,
      suggestions: [],
    };
  }

  componentDidMount() {
    window.addEventListener("hashchange", () => {
      const h = window.location.hash;
      if (h === "#/cart") {
        this.setState({ hide: false });
      } else {
        this.setState({ hide: true });
      }
    });
    const h = window.location.hash;
    if (h === "#/cart") {
      this.setState({ hide: false });
    } else {
      this.setState({ hide: true });
    }

    this.fetchSuggestions();
  }

  fetchSuggestions = async () => {
    const sessionRequest = await fetch("/api/sessions?items=*");
    const session = await sessionRequest.json();

    const sc = session?.namespaces?.store?.channel?.value ?? 1;

    fetch(
      `/api/catalog_system/pub/products/search?fq=productClusterIds:${configsShelf.idCollection}&${shelfOrdenation}&isAvailablePerSalesChannel_${sc}:1`
    ).then((res) =>
      res.json().then((res) => {
        this.setState({ suggestions: filterProducts(res) });
      })
    );
  };

  render() {
    if (this.state.suggestions.length > 0) {
      return (
        <div
          id="sugerencias-de-compra"
          className={classNames("container", { hide: this.state.hide })}
        >
          <div className="wrapper">
            <div className="title">Completa tu compra</div>
            <div className="suggestions">
              <Slider {...sliderSettings}>
                {_.shuffle(this.state.suggestions).map((s, i) => {
                  return <Shelf item={s} key={i} />;
                })}
              </Slider>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
