import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
} from "react-icons/fa";

import {
  IoIosHeart,
  IoIosHeartEmpty,
} from "react-icons/io";

import {
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import {
  addToWishlist,
  removeFromWishlist,
} from "../Redux/Slices/WishlistSlice";

function Newproductslider() {

  const [products, setProducts] = useState([]);
  const [cardsToShow, setCardsToShow] = useState(4);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.Wishlist?.items || []
  );

  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      dragFree: false,
      skipSnaps: false,
      duration: 25,
      containScroll: "trimSnaps",
    },
    [autoplay.current]
  );


  useEffect(() => {
    fetch("https://api.onstage.co.in/api/v1/newProducts")
      .then((res) => res.json())
      .then((data) => {
        const arr =
          data?.data ||
          data?.products ||
          data ||
          [];

        setProducts(arr);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {

    const resize = () => {

      if (window.innerWidth < 576) {
        setCardsToShow(1);
      }

      else if (window.innerWidth < 768) {
        setCardsToShow(2);
      }

      else if (window.innerWidth < 992) {
        setCardsToShow(3);
      }

      else if (window.innerWidth < 1400) {
        setCardsToShow(5);
      }

      else {
        setCardsToShow(6);
      }

    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    return () =>
      window.removeEventListener(
        "resize",
        resize
      );

  }, []);

  useEffect(() => {

    if (!emblaApi) return;

    emblaApi.reInit();

    autoplay.current.reset();

  }, [cardsToShow, emblaApi]);

  const prev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const next = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  const handleClick = (item) => {

    const id =
      item._id ||
      item.product_id ||
      item.id;

    if (!id) return;

    navigate(`/productDetails/${id}`, {
      state: {
        ...item,
        product_id: id,
      },
    });

  };

  return (

    <section className="ps-section">

      <div className="ps-container">

        <div className="latest-products-header">

          <h2 className="latest-products-heading">
            LATEST PRODUCTS
          </h2>

          <p className="latest-products-tagline">
            Explore our newest arrivals and discover trending products.
          </p>

        </div>

        <div className="ps-wrapper">

          <button
            type="button"
            className="np-arrow np-left"
            onClick={prev}
          >
            <FaChevronLeft />
          </button>

          <div
            className="np-embla"
            ref={emblaRef}
          >

            <div className="np-embla__container">

              {products.map((item) => {

                const brand =
                  item.Brand_Name ||
                  item.brand ||
                  "BRAND";

                const category =
                  item.Product_Subcategory ||
                  item.category ||
                  "Category";

                const name =
                  item.Product_Name ||
                  item.name;

                const price = Math.round(
                  Number(
                    item.MRP ||
                    item.Product_price ||
                    item.price ||
                    0
                  )
                );

                const oldPrice = Math.round(
                  Number(
                    item.Product_price ||
                    item.Product_old_price ||
                    item.mrp ||
                    0
                  )
                );

                const image =
                  item.image_01 ||
                  item.image ||
                  "/no-image.png";

                const id =
                  item._id ||
                  item.product_id ||
                  item.id;

                const isWishlisted = wishlistItems.some(
                  (w) =>
                    String(
                      w.product_id ||
                      w._id ||
                      w.id
                    ) === String(id)
                );

                return (

                  <div
                    className="np-embla__slide"
                    key={id}
                  >

                    <div
                      className="ecom-product-card"
                      onClick={() => handleClick(item)}
                    >

                      <div className="ecom-product-img">

                        <div className="product-new-badge">
                          NEW
                        </div>

                        <div
                          className={`wishlist-box ${isWishlisted ? "active" : ""
                            }`}
                          onClick={(e) => {

                            e.stopPropagation();

                            if (isWishlisted) {

                              dispatch(removeFromWishlist(id));

                              window.showNotification(
                                "Removed from Wishlist",
                                "info"
                              );

                            } else {

                              dispatch(
                                addToWishlist({
                                  ...item,
                                  product_id: id,
                                })
                              );

                              window.showNotification(
                                "Added to Wishlist",
                                "success"
                              );

                            }

                          }}
                        >

                          {isWishlisted ? (
                            <IoIosHeart className="wishlist-icon filled" />
                          ) : (
                            <IoIosHeartEmpty className="wishlist-icon" />
                          )}

                        </div>

                        <img
                          src={image}
                          alt={name}
                          draggable={false}
                        />

                      </div>

                      <div className="ecom-product-info">

                        <h5 className="ecom-brand">
                          {brand.toUpperCase()}
                        </h5>

                        <p className="ecom-model">
                          Model - {item.Model_number}
                        </p>

                        <p className="ecom-type">
                          {category}
                        </p>

                        <div className="ecom-price-box">

                          <span className="ecom-price">
                            MRP ₹{formatPrice(price)}
                          </span>

                          {Number(item.totalReviews) > 0 && (
                            <span className="ecom-rating">
                              <FaStar className="rating-star" />
                              {Number(item.averageRating).toFixed(1)}
                              ({item.totalReviews})
                            </span>
                          )}

                          {oldPrice > price && (
                            <span className="ecom-old-price">
                              ₹{formatPrice(oldPrice)}
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

          <button
            type="button"
            className="np-arrow np-right"
            onClick={next}
          >
            <FaChevronRight />
          </button>

        </div>
      </div>

    </section>

  );
}

export default Newproductslider;