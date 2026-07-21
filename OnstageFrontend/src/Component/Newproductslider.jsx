import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import {
  addToWishlist,
  removeFromWishlist,
} from "../Redux/Slices/WishlistSlice";



function Newproductslider() {
  const [products, setProducts] = useState([]);
  const [cardsToShow, setCardsToShow] = useState(4);
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.Wishlist?.items || []
  );

  // ✅ API
  useEffect(() => {
    fetch("https://api.onstage.co.in/api/v1/newProducts")
      .then((res) => res.json())
      .then((data) => {
        const arr = data?.data || data?.products || data || [];
        setProducts(arr);
      })
      .catch((err) => console.log(err));
  }, []);


  // ✅ Responsive
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 576) setCardsToShow(1);
      else if (window.innerWidth < 768) setCardsToShow(2);
      else if (window.innerWidth < 992) setCardsToShow(3);
      else if (window.innerWidth < 1400) setCardsToShow(5);
      else setCardsToShow(6); // Large Desktop = 6 cards
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  // ✅ Start position
  useEffect(() => {
    if (products.length > 0) {
      setCurrent(cardsToShow);
    }
  }, [products, cardsToShow]);

  // ✅ Infinite data
  const extended = [
    ...products.slice(-cardsToShow),
    ...products,
    ...products.slice(0, cardsToShow),
  ];

  // ✅ Auto slide
  useEffect(() => {
    if (!products.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [products]);

  // ✅ Infinite loop fix
  useEffect(() => {
    if (!products.length) return;

    if (current >= products.length + cardsToShow) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(cardsToShow);
      }, 600);
    }

    if (current <= 0) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(products.length);
      }, 600);
    }

    setTimeout(() => setTransition(true), 650);
  }, [current, products.length, cardsToShow]);

  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  // ✅ Price format
  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  // ✅ Click
  const handleClick = (item) => {
    const id = item._id || item.product_id || item.id;

    if (!id) return;

    navigate(`/productDetails/${id}`, {
      state: {
        ...item,
        product_id: id,
      },
    });
  };

  const translate = current * (100 / cardsToShow);

  return (
    <section className="ps-section">
      <div className="ps-container">

        {/* Heading */}
        <div className="latest-products-header">
          <h2 className="latest-products-heading">
            LATEST PRODUCTS
          </h2>

          <p className="latest-products-tagline">
            Explore our newest arrivals and discover trending products.
          </p>
        </div>
        <div className="ps-wrapper">
          <button className="ps-arrow ps-left" onClick={prev}>
            <FaChevronLeft />
          </button>

          <div className="ps-slider">
            <div
              className="ps-track"
              style={{
                transform: `translateX(-${translate}%)`,
                transition: transition ? "transform .6s ease" : "none",
              }}
            >
              {extended.map((item, i) => {
                // console.log("this is item: ", item);

                // ✅ SAFE DATA MAPPING (FIX 🔥)
                const brand = item.Brand_Name || item.brand || "BRAND";
                const category =
                  item.Product_Subcategory || item.category || "Category";
                const name = item.Product_Name;

                // Black MRP (kam price)
                const price = Math.round(
                  Number(item.MRP || item.Product_price || item.price || 0)
                );

                // Orange Cut Price (zyada price)
                const oldPrice = Math.round(
                  Number(item.Product_price || item.Product_old_price || item.mrp || 0)
                );

                const image =
                  item.image_01 || item.image || "/no-image.png";
                const id = item._id || item.product_id || item.id;

                const isWishlisted = wishlistItems.some(
                  (w) =>
                    String(w.product_id || w._id || w.id) ===
                    String(id)
                );

                return (
                  <div className="ecom-product-card"
                    key={i}
                    style={{
                      flex: `0 0 ${100 / cardsToShow}%`,
                      width: `${100 / cardsToShow}%`,
                      minWidth: `${100 / cardsToShow}%`,
                      padding: "0",
                      boxSizing: "border-box",
                    }}
                    onClick={() => handleClick(item)}
                  >
                    <div className="ecom-product-img">

                      {/* NEW Badge */}
                      <div className="product-new-badge">
                        NEW
                      </div>

                      <div
                        className={`wishlist-box ${isWishlisted ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (isWishlisted) {
                            dispatch(removeFromWishlist(id));
                            window.showNotification("Removed from Wishlist", "info");
                          } else {
                            dispatch(
                              addToWishlist({
                                ...item,
                                product_id: id,
                              })
                            );

                            window.showNotification("Added to Wishlist", "success");
                          }
                        }}
                      >
                        {isWishlisted ? (
                          <IoIosHeart className="wishlist-icon filled" />
                        ) : (
                          <IoIosHeartEmpty className="wishlist-icon" />
                        )}
                      </div>

                      <img src={image} alt={name} />
                    </div>
                    <div className="ecom-product-info">
                      <h5 className="ecom-brand">{brand.toUpperCase()}</h5>
                      <p className="ecom-model">Model - {item.Model_number}</p>
                      <p className="ecom-type">{category}</p>
                      <div className="ecom-price-box">
                        <span className="ecom-price">
                          MRP ₹{formatPrice(price)}
                        </span>

                        {Number(item.totalReviews) > 0 && (
                          <span className="ecom-rating">
                            <FaStar className="rating-star" />
                            {Number(item.averageRating).toFixed(1)} ({item.totalReviews})
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
                );
              })}
            </div>
          </div>

          <button className="ps-arrow ps-right" onClick={next}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Newproductslider;