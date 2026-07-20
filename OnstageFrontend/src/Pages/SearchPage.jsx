import React, { useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";

// ❤️ ICONS
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

// 🔥 REDUX
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../Redux/Slices/WishlistSlice";

export default function SearchPage() {
  const {
    searchResults,
    loading,
    setSearchQuery,
    handleSearch,
  } = useSearch();

  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.Wishlist?.items || []);

  // 🔥 URL BASED SEARCH (FIXED)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");

    if (query) {
      setSearchQuery(query);
      handleSearch(query); // ✅ FIX
    }
  }, [location.search]);

  // ✅ PRODUCT CLICK
  const handleProductClick = (product) => {
    if (!product || !product.product_id) return;
    navigate(`/productDetails/${product.product_id}`, { state: product });
  };

  // ✅ LOADING STATE
  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  // ✅ NO PRODUCT FOUND UI (FIXED)
  if (!loading && (!searchResults || searchResults.length === 0)) {
    return (
      <div className="no-products-found">

        <img
          src="https://pub-1cfbd62bb18344a08190c13684f63517.r2.dev/274/Gemini_Generated_Image_juv4kfjuv4kfjuv4%201-Photoroom.png"
          alt="No products"
          className="no-products-img"
        />

        <h2>No Products Found</h2>
        <p>Please try another search or category</p>

        <button
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>

      </div>
    );
  }

  console.log(searchResults)

  return (
    <section className="ecom-products-section">

      <div className="container">

        <h2 className="ecom-products-heading">
          Search Results
        </h2>

        <div className="ecom-products-grid">
          {searchResults.map((item, index) => {

            if (!item) return null;
            const brand = item?.Brand_Name || "";
            const type = item?.Product_Subcategory || "";
            const name = item?.Product_Name || "";

            const price = item?.Product_price || 0;
            const oldPrice = item?.Product_old_price || 0;

            const image = item?.image_01 || item?.Product_Image || "";
            const model = item?.Model_number || "";

            const isWishlisted =
              Array.isArray(wishlistItems) &&
              wishlistItems.some(
                (w) => w && w.product_id === item?.product_id
              );

            return (
              <div
                className="ecom-product-card"
                key={item.product_id || index}
                onClick={() => handleProductClick(item)}
              >

                <div
                  className="ecom-product-img"
                  style={{ position: "relative" }}
                >
                  <img src={image} alt={name} />
                  {/* ❤️ WISHLIST */}
                  <div
                    className={`wishlist-box ${isWishlisted ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (!item || !item.product_id) return;

                      if (isWishlisted) {

                        dispatch(removeFromWishlist(item.product_id));

                        window.showNotification(
                          "Removed from Wishlist",
                          "info"
                        );

                      } else {

                        dispatch(addToWishlist(item));

                        window.showNotification(
                          "Added to Wishlist",
                          "success"
                        );

                      }
                    }}
                  >
                    {isWishlisted ? (
                      <IoIosHeart size={22} color="red" />
                    ) : (
                      <IoIosHeartEmpty size={22} />
                    )}
                  </div>

                </div>

                <div className="ecom-product-info">
                  <h5 className="ecom-brand">
                    {item.Brand_Name}
                  </h5>

                  <p className="ecom-model">
                    Model - {item.Model_number}
                  </p>

                  <p className="ecom-type">
                    {item.Product_Category || item.Product_Subcategory}
                  </p>

                  <div className="ecom-price-box">

                    <span className="ecom-price">
                      ₹{Math.round(Number(item.MRP || 0)).toLocaleString("en-IN")}
                    </span>

                    {Number(item.Product_price || 0) > Number(item.MRP || 0) && (
                      <span className="ecom-old-price">
                        ₹{Math.round(Number(item.Product_price || 0)).toLocaleString("en-IN")}
                      </span>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}