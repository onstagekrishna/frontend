import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { addToWishlist, removeFromWishlist } from "../Redux/Slices/WishlistSlice";

const accessoryWords = [
  "hanger", "holder", "stand", "capo", "mute", "mutes",
  "damper", "dampener", "strap", "string", "strings",
  "pick", "picks", "cable", "case", "bag", "cover",
  "pedal", "tuner", "accessory", "accessories",
];

export default function AccessoriesSlider() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sliderRef = useRef(null);

  const wishlistItems = useSelector((state) => state.Wishlist?.items || []);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pauseSlider, setPauseSlider] = useState(false);

  const clean = (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ");

  const getProductId = (item) => item?._id || item?.product_id || item?.id;

  const getPrice = (item) => Number(item?.price || item?.Product_price || 0);

  const getStock = (item) => {
    const stock = item?.Product_Quantity ?? item?.stock ?? item?.quantity;
    if (stock === undefined || stock === null || stock === "") return 1;
    return Number(stock);
  };

  const getSearchText = (item) =>
    clean(
      `${item?.Product_Name || item?.name || ""} 
       ${item?.Product_Subcategory || item?.category || ""} 
       ${item?.Product_Category || ""}`
    );

  const isAccessory = (item) => {
    const text = getSearchText(item);
    return accessoryWords.some((word) => text.includes(word));
  };

  useEffect(() => {
    async function fetchAccessories() {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.onstage.co.in/api/v1/categoryProduct?type=${encodeURIComponent(
            "Accessories"
          )}`
        );

        const data = await res.json();

        const arr = data?.products || [];

        console.log("API Products:", arr.length);

        setProducts(arr);

      } catch (err) {
        console.log("Accessories Slider Error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAccessories();
  }, []);


  useEffect(() => {
    if (!products.length || pauseSlider) return;

    const slider = sliderRef.current;

    const autoSlide = setInterval(() => {
      if (!slider) return;

      const card = slider.querySelector(".acc-home-card");

      if (!card) return;

      const gap = 14;
      const moveAmount = card.offsetWidth + gap;

      const maxScroll = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft >= maxScroll - 5) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: moveAmount,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(autoSlide);
  }, [products, pauseSlider]);

  const scrollSlider = (direction) => {
    const card = sliderRef.current?.querySelector(".acc-home-card");

    if (!card) return;

    const gap = 20;
    const cardWidth = card.offsetWidth + gap;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const handleProductClick = (item) => {
    const productId = getProductId(item);
    if (!productId) return;

    navigate(`/productDetails/${productId}`, { state: item });
  };

  if (loading) {
    return (
      <section className="acc-home-section">
        <h2 className="acc-home-title">Accessories Collection</h2>
        <p className="acc-loading">Loading...</p>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="acc-home-section">

      <div className="site-container">

        <div className="acc-home-container">

          {/* Heading */}
          <div className="acc-section-header">
            <h2 className="acc-section-heading">
              ACCESSORIES
            </h2>

            <p className="acc-section-tagline">
              Discover essential music gear and accessories for every musician.
            </p>
          </div>

          <div
            className="acc-home-slider-wrap"
            onMouseEnter={() => setPauseSlider(true)}
            onMouseLeave={() => setPauseSlider(false)}
          >
            <button
              className="acc-slide-btn acc-left"
              onClick={() => scrollSlider("left")}
            >
              <MdKeyboardArrowLeft />
            </button>

            <div className="acc-home-slider" ref={sliderRef}>
              {products.map((item, index) => {

                const productId = getProductId(item);

                const isWishlisted =
                  Array.isArray(wishlistItems) &&
                  wishlistItems.some(
                    (w) => (w.product_id || w._id || w.id) === productId
                  );

                return (
                  <div
                    className="acc-home-card"
                    key={productId || index}
                    onClick={() => handleProductClick(item)}
                  >
                    <div className="acc-home-img" style={{ background: "#e3e3e3" }}>
                      <button
                        className={`acc-home-wishlist ${isWishlisted ? "active" : ""
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (isWishlisted) {
                            dispatch(removeFromWishlist(productId));

                            window.showNotification(
                              "Removed from Wishlist",
                              "info"
                            );
                          } else {
                            dispatch(
                              addToWishlist({
                                ...item,
                                product_id: productId,
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
                          <IoIosHeart />
                        ) : (
                          <IoIosHeartEmpty />
                        )}
                      </button>

                      <img
                        src={item.image_01 || item.image || "/no-image.png"}
                        alt={item.Product_Name || item.name}
                        style={{ mixBlendMode: "multiply" }}
                      />
                    </div>

                    <div className="acc-home-info">
                      <h5 className="acc-brand">
                        {item.Brand_Name || "Brand"}
                      </h5>

                      <p className="acc-model">
                        Model - {item.Model_number || "N/A"}
                      </p>

                      <p className="acc-category">
                        {item.Product_Subcategory}
                      </p>

                      <div className="acc-home-price">

                        <span className="acc-price">
                          MRP ₹{Math.floor(Number(item.MRP || 0)).toLocaleString("en-IN")}
                        </span>

                        {Number(item.totalReviews || 0) > 0 && (
                          <span className="ecom-rating">
                            <FaStar className="rating-star" />
                            {Number(item.averageRating || 0).toFixed(1)} ({item.totalReviews})
                          </span>
                        )}

                        {Number(item.Product_price || item.price || 0) >
                          Number(item.MRP || 0) && (
                            <del className="acc-old-price">
                              ₹{Math.floor(
                                Number(item.Product_price || item.price || 0)
                              ).toLocaleString("en-IN")}
                            </del>
                          )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="acc-slide-btn acc-right"
              onClick={() => scrollSlider("right")}
            >
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );

}