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

import { useNavigate } from "react-router-dom";

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


const accessoryWords = [
  "hanger",
  "holder",
  "stand",
  "capo",
  "mute",
  "mutes",
  "damper",
  "dampener",
  "strap",
  "string",
  "strings",
  "pick",
  "picks",
  "cable",
  "case",
  "bag",
  "cover",
  "pedal",
  "tuner",
  "accessory",
  "accessories",
];


function AccessoriesSlider() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardsToShow, setCardsToShow] = useState(4);

  const wishlistItems = useSelector(
    (state) => state.Wishlist?.items || []
  );


  /*
   * AUTOPLAY
   */
  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );


  /*
   * EMBLA
   */
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


  /*
   * CLEAN TEXT
   */
  const clean = (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ");


  /*
   * PRODUCT ID
   */
  const getProductId = (item) =>
    item?._id ||
    item?.product_id ||
    item?.id;


  /*
   * SEARCH TEXT
   */
  const getSearchText = (item) =>
    clean(`
      ${item?.Product_Name || item?.name || ""}
      ${item?.Product_Subcategory || item?.category || ""}
      ${item?.Product_Category || ""}
    `);


  /*
   * ACCESSORY CHECK
   */
  const isAccessory = (item) => {

    const text = getSearchText(item);

    return accessoryWords.some((word) =>
      text.includes(word)
    );
  };


  /*
   * FETCH ACCESSORIES
   */
  useEffect(() => {

    const fetchAccessories = async () => {

      try {

        setLoading(true);

        const res = await fetch(
          `https://api.onstage.co.in/api/v1/categoryProduct?type=${encodeURIComponent(
            "Accessories"
          )}`
        );

        const data = await res.json();

        const arr =
          data?.products ||
          data?.data ||
          data ||
          [];

        /*
         * Agar API already Accessories return karti hai
         * to direct use hoga.
         *
         * Otherwise keyword filter bhi available hai.
         */
        const accessoryProducts = Array.isArray(arr)
          ? arr.filter(isAccessory)
          : [];

        /*
         * Agar keyword filtering ke baad kuch nahi mila,
         * API ke products hi use karenge.
         */
        setProducts(
          accessoryProducts.length
            ? accessoryProducts
            : Array.isArray(arr)
              ? arr
              : []
        );

      } catch (error) {

        console.error(
          "Accessories Slider Error:",
          error
        );

        setProducts([]);

      } finally {

        setLoading(false);

      }

    };

    fetchAccessories();

  }, []);


  /*
   * RESPONSIVE CARDS
   */
  useEffect(() => {

    const resize = () => {

      if (window.innerWidth < 576) {

        setCardsToShow(1);

      } else if (window.innerWidth < 768) {

        setCardsToShow(2);

      } else if (window.innerWidth < 992) {

        setCardsToShow(3);

      } else if (window.innerWidth < 1400) {

        setCardsToShow(5);

      } else {

        setCardsToShow(6);

      }

    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    return () => {

      window.removeEventListener(
        "resize",
        resize
      );

    };

  }, []);


  /*
   * REINITIALIZE EMBLA
   */
  useEffect(() => {

    if (!emblaApi) return;

    emblaApi.reInit();

    autoplay.current.reset();

  }, [
    cardsToShow,
    emblaApi,
    products,
  ]);


  /*
   * PREVIOUS
   */
  const prev = useCallback(() => {

    emblaApi?.scrollPrev();

  }, [emblaApi]);


  /*
   * NEXT
   */
  const next = useCallback(() => {

    emblaApi?.scrollNext();

  }, [emblaApi]);


  /*
   * PRODUCT CLICK
   */
  const handleProductClick = (item) => {

    const id = getProductId(item);

    if (!id) return;

    navigate(
      `/productDetails/${id}`,
      {
        state: {
          ...item,
          product_id: id,
        },
      }
    );

  };


  /*
   * PRICE FORMAT
   */
  const formatPrice = (price) =>
    Number(price || 0).toLocaleString(
      "en-IN"
    );


  /*
   * LOADING
   */
  if (loading) {

    return (
      <section className="acc-home-section">

        <div className="site-container">

          <div className="acc-section-header">

            <h2 className="acc-section-heading">
              ACCESSORIES
            </h2>

            <p className="acc-section-tagline">
              Discover essential music gear and
              accessories for every musician.
            </p>

          </div>

          <p className="acc-loading">
            Loading...
          </p>

        </div>

      </section>
    );

  }


  /*
   * NO PRODUCTS
   */
  if (!products.length) {
    return null;
  }


  return (

    <section className="acc-home-section">

      <div className="site-container">

        <div className="acc-home-container">


          {/* HEADER */}

          <div className="acc-section-header">

            <h2 className="acc-section-heading">
              ACCESSORIES
            </h2>

            <p className="acc-section-tagline">
              Discover essential music gear and
              accessories for every musician.
            </p>

          </div>


          {/* SLIDER */}

          <div className="acc-home-slider-wrap">


            {/* LEFT ARROW */}

            <button
              type="button"
              className="acc-slide-btn acc-left"
              onClick={prev}
              aria-label="Previous products"
            >

              <FaChevronLeft />

            </button>


            {/* EMBLA */}

            <div
              className="acc-home-slider"
              ref={emblaRef}
            >

              <div className="acc-home-slider-container">


                {products.map((item, index) => {

                  const productId =
                    getProductId(item);


                  const isWishlisted =
                    wishlistItems.some(
                      (w) =>
                        String(
                          w.product_id ||
                          w._id ||
                          w.id
                        ) ===
                        String(productId)
                    );


                  const brand =
                    item.Brand_Name ||
                    item.brand ||
                    "BRAND";


                  const category =
                    item.Product_Subcategory ||
                    item.category ||
                    "Accessories";


                  const name =
                    item.Product_Name ||
                    item.name ||
                    "Product";


                  const image =
                    item.image_01 ||
                    item.image ||
                    "/no-image.png";


                  const price =
                    Math.round(
                      Number(
                        item.MRP ||
                        item.Product_price ||
                        item.price ||
                        0
                      )
                    );


                  const oldPrice =
                    Math.round(
                      Number(
                        item.Product_price ||
                        item.price ||
                        item.Product_old_price ||
                        0
                      )
                    );


                  return (

                    <div
                      className="acc-home-slide"
                      key={
                        productId ||
                        index
                      }
                    >

                      <div
                        className="acc-home-card"
                        onClick={() =>
                          handleProductClick(item)
                        }
                      >


                        {/* IMAGE */}

                        <div className="acc-home-img">

                          {/* WISHLIST */}

                          <div
                            className={`acc-home-wishlist ${
                              isWishlisted
                                ? "active"
                                : ""
                            }`}
                            onClick={(e) => {

                              e.stopPropagation();


                              if (
                                isWishlisted
                              ) {

                                dispatch(
                                  removeFromWishlist(
                                    productId
                                  )
                                );


                                window.showNotification?.(
                                  "Removed from Wishlist",
                                  "info"
                                );

                              } else {

                                dispatch(
                                  addToWishlist({
                                    ...item,
                                    product_id:
                                      productId,
                                  })
                                );


                                window.showNotification?.(
                                  "Added to Wishlist",
                                  "success"
                                );

                              }

                            }}
                          >

                            {isWishlisted ? (

                              <IoIosHeart />

                            ) : (

                              <IoIosHeartEmpty />

                            )}

                          </div>


                          {/* PRODUCT IMAGE */}

                          <img
                            src={image}
                            alt={name}
                            draggable={false}
                          />

                        </div>


                        {/* INFO */}

                        <div className="acc-home-info">


                          <h5 className="acc-brand">

                            {String(
                              brand
                            ).toUpperCase()}

                          </h5>


                          <p className="acc-model">

                            Model -{" "}
                            {item.Model_number ||
                              "N/A"}

                          </p>


                          <p className="acc-category">

                            {category}

                          </p>


                          {/* PRICE */}

                          <div className="acc-home-price">


                            <span className="acc-price">

                              MRP ₹
                              {formatPrice(
                                price
                              )}

                            </span>


                            {/* RATING */}

                            {Number(
                              item.totalReviews
                            ) > 0 && (

                              <span className="ecom-rating">

                                <FaStar className="rating-star" />

                                {Number(
                                  item.averageRating ||
                                    0
                                ).toFixed(1)}

                                (
                                {
                                  item.totalReviews
                                }
                                )

                              </span>

                            )}


                            {/* OLD PRICE */}

                            {oldPrice >
                              price && (

                              <span className="acc-old-price">

                                ₹
                                {formatPrice(
                                  oldPrice
                                )}

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


            {/* RIGHT ARROW */}

            <button
              type="button"
              className="acc-slide-btn acc-right"
              onClick={next}
              aria-label="Next products"
            >

              <FaChevronRight />

            </button>

          </div>

        </div>

      </div>

    </section>

  );

}

export default AccessoriesSlider;