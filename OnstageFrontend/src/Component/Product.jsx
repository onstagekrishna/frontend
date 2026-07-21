import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../Redux/Slices/WishlistSlice";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";



const tabs = [
  {
    label: "ACOUSTIC GUITARS",
    type: "Acoustic Guitars",
  },
  {
    label: "ELECTRIC GUITARS",
    type: "Electric Guitars",
  },
  {
    label: "AMPLIFIERS",
    type: "Amplifiers",
  },
  {
    label: "MPC",
    type: "MPC",
  },
  {
    label: "CONTROLLERS",
    type: "Controllers",
  },
  {
    label: "PIANO & KEYBOARDS",
    type: "Piano & Keyboards",
  },
  {
    label: "GUITARS STRING",
    type: "String",
  },
  {
    label: "STRAPS",
    type: "Straps",
  },
];

const AllProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.Wishlist?.items || []);

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fade, setFade] = useState(false);



  const formatPrice = (value) =>
    Math.round(Number(value || 0)).toLocaleString("en-IN");

  const getProductId = (item) => item?._id || item?.product_id || item?.id;

  const getPrice = (item) => Number(item?.price || item?.Product_price || 0);

  const getStock = (item) => {
    const stock = item?.Product_Quantity ?? item?.stock ?? item?.quantity;
    if (stock === undefined || stock === null || stock === "") return 1;
    return Number(stock);
  };



  const fetchProductsByType = async (tab) => {
    try {
      setFade(true);
      setLoading(true);

      const res = await fetch(
        `https://api.onstage.co.in/api/v1/categoryProduct?type=${encodeURIComponent(
          tab.type
        )}`
      );

      const data = await res.json();

      const arr = data?.data || data?.products || [];

      const sortedProducts = Array.isArray(arr)
        ? arr.filter(
          (item) =>
            item.Model_number &&
            item.Model_number.trim() !== ""
        )
        : [];

      setTimeout(() => {
        setProducts(sortedProducts);
        setLoading(false);
        setFade(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setProducts([]);
      setLoading(false);
      setFade(false);
    }
  };

  const handleCategoryClick = (tab, index) => {
    setActiveTab(tab);
    setActiveIndex(index);
    fetchProductsByType(tab);
  };

  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTab(tabs[0]);
      setActiveIndex(0);
      fetchProductsByType(tabs[0]);
    }
  }, []);

  const visibleProducts = useMemo(() => products.slice(0, 15), [products]);

  const handlePage = (item) => {
    const id = getProductId(item);
    if (!id) return;

    navigate(`/productDetails/${id}`, { state: item });
  };

  const handleViewMore = () => {
    navigate("/category", {
      state: {
        type: activeTab.type,
        onlyMainProducts: true,
        hideAccessories: true,
      },
    });
  };

  return (
    <>
      <section className="ecom-products-section">
        <div className="guitar-products-container">

          {/* Heading */}
          <div className="guitar-section-header">
            <h2 className="guitar-section-heading">
              SHOP MUSICAL ESSENTIALS
            </h2>

            <p className="guitar-section-tagline">
              Quality instruments and accessories for every musician.
            </p>
          </div>

          {/* Tabs */}
          <div className="guitar-tabs">
            {tabs.map((tab, index) => (
              <button
                type="button"
                key={tab.label}
                className={`guitar-tab-btn ${activeIndex === index ? "active" : ""
                  }`}
                onClick={() => handleCategoryClick(tab, index)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Products */}
          {loading ? (
            <div className="loading-gif-on-product-change">
              <img
                src="https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/new%20mackie%20product/Onstage-loading.gif "
                alt="loading.."
                loading="lazy"
              />
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="no-products">
              <img
                src="https://pub-1cfbd62bb18344a08190c13684f63517.r2.dev/274/Gemini_Generated_Image_juv4kfjuv4kfjuv4%201-Photoroom.png"
                alt="No Products Available"
                className="no-products-img"
              />

              <h3 className="no-products-title">
                No Products Available
              </h3>

              <p className="no-products-text">
                Products will be available in this category soon.
                Please check back later.
              </p>
            </div>
          ) : (
            <div
              className={`ecom-products-grid fade-container ${fade ? "fade-out" : "fade-in"
                }`}
            >
              {visibleProducts.map((item, index) => {
                const productId = getProductId(item);
                const mrp = Number(item?.MRP || 0);
                const cutPrice = Number(item?.Product_price || 0);

                const isWishlisted =
                  Array.isArray(wishlistItems) &&
                  wishlistItems.some(
                    (w) => (w.product_id || w._id || w.id) === productId
                  );

                return (
                  <div
                    className="ecom-product-card"
                    key={productId || index}
                    onClick={() => handlePage(item)}
                  >
                    <div className="ecom-product-img">
                      <div
                        className={`wishlist-box ${isWishlisted ? "active" : ""
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
                          <IoIosHeart className="wishlist-icon filled" />
                        ) : (
                          <IoIosHeartEmpty className="wishlist-icon" />
                        )}
                      </div>

                      <img
                        src={item.image_01 || item.image || "/no-image.png"}
                        alt={item.name || item.Product_Name}
                        loading="lazy"
                        onMouseEnter={(e) => {
                          if (item.image_02) {
                            e.currentTarget.src = item.image_02;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.src =
                            item.image_01 || item.image || "/no-image.png";
                        }}
                        onError={(e) => {
                          e.target.src = "/no-image.png";
                        }}
                      />
                    </div>

                    <div className="ecom-product-info">
                      <h5 className="ecom-brand">
                        {item.Brand_Name}
                      </h5>
                      <p className="ecom-model">
                        Model - {item.Model_number}
                      </p>
                      <p className="ecom-type">
                        {item.Product_Category}
                      </p>

                      <div className="ecom-price-box">
                        <span className="ecom-price">
                          MRP ₹{formatPrice(mrp)}
                        </span>

                        {Number(item.totalReviews || 0) > 0 && (
                          <span className="ecom-rating">
                            <FaStar className="rating-star" />
                            {Number(item.averageRating || 0).toFixed(1)} ({item.totalReviews})
                          </span>
                        )}

                        {cutPrice > mrp && (
                          <span className="ecom-old-price">
                            ₹{formatPrice(cutPrice)}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default AllProducts;