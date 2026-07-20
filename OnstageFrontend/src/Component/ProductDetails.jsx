import { useLocation, useParams, Link } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Toast from "./Toast";
import { addToCart } from "../Redux/Slices/CartSlice";
import { addToWishlist, removeFromWishlist, } from "../Redux/Slices/WishlistSlice";
import LoadingIcon from "./LoadingIcon";

export default function ProductDetails() {
  const { product_id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector(
    (state) => state.Wishlist?.items || []
  );

  const [productDetails, setProductDetails] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(location.state?.image_01 || "");

  const [recommendations, setRecommendations] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const formatPrice = (value) => {
    return Math.round(Number(value || 0)).toLocaleString("en-IN");
  };

  const getProductId = (item) => item?.product_id || item?._id || item?.id;

  const validImage = (img) => {
    return (
      img &&
      img.toLowerCase() !== "none" &&
      (img.startsWith("http://") || img.startsWith("https://"))
    );
  };

  const isValidProduct = (item) => {
    const price = Number(item?.MRP || 0);
    const stock = item?.Product_Quantity;

    if (price <= 0) return false;

    if (stock === undefined || stock === null || stock === "") {
      return true;
    }

    return Number(stock) > 0;
  };
  const totalPrice = productDetails?.MRP || 0;

  const stock = Number(productDetails?.Product_Quantity || 0);
  const isOutOfStock = stock === 0;
  const isZeroPrice = Number(totalPrice) <= 0;
  const disableAddToCart = isOutOfStock || isZeroPrice;

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setQuantity(1);

        const res = await axios.get(
          "https://api.onstage.co.in/api/v1/categoryProduct?page=1&limit=5000"
        );

        if (res.data?.products) {
          const allProducts = res.data.products;
          setAllProducts(allProducts);

          console.log("URL Product ID:", product_id);
          console.log("First 5 Products:", allProducts.slice(0, 5));
          console.log(
            "All Product IDs:",
            allProducts.map((item) => item.product_id)
          );

          let currentProduct = location.state;

          if (!currentProduct) {
            currentProduct = allProducts.find(
              (item) => String(item.product_id) === String(product_id)
            );

            console.log("Found Product:", currentProduct);
          }

          if (currentProduct) {
            setProductDetails(currentProduct);
            setMainImage(currentProduct.image_01 || "");
          }
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [product_id, location.state]);

  useEffect(() => {
    if (!productDetails || allProducts.length === 0) return;

    setLoadingRecommendations(true);

    const currentId = String(getProductId(productDetails));

    const currentPrice = Number(productDetails.MRP || 0);

    // Dynamic Price Range
    let percent = 0.10;

    if (currentPrice <= 10000) {
      percent = 0.20;
    } else if (currentPrice <= 50000) {
      percent = 0.15;
    }

    const minPrice = currentPrice * (1 - percent);
    const maxPrice = currentPrice * (1 + percent);

    let related = [];

    const addProducts = (products) => {
      products.forEach((item) => {
        if (
          String(getProductId(item)) !== currentId &&
          !related.some(
            (r) => String(getProductId(r)) === String(getProductId(item))
          )
        ) {
          related.push(item);
        }
      });
    };

    // 1️⃣ Same Brand + Same Category + Similar Price
    addProducts(
      allProducts.filter(
        (item) =>
          item.Brand_Name === productDetails.Brand_Name &&
          item.Product_Category === productDetails.Product_Category &&
          Number(item.MRP || 0) >= minPrice &&
          Number(item.MRP || 0) <= maxPrice
      )
    );

    // 2️⃣ Same Brand + Same Category
    if (related.length < 10) {
      addProducts(
        allProducts.filter(
          (item) =>
            item.Brand_Name === productDetails.Brand_Name &&
            item.Product_Category === productDetails.Product_Category
        )
      );
    }

    // 3️⃣ Same Category + Similar Price
    if (related.length < 10) {
      addProducts(
        allProducts.filter(
          (item) =>
            item.Product_Category === productDetails.Product_Category &&
            Number(item.MRP || 0) >= minPrice &&
            Number(item.MRP || 0) <= maxPrice
        )
      );
    }

    // 4️⃣ Same Subcategory + Similar Price
    if (related.length < 10) {
      addProducts(
        allProducts.filter(
          (item) =>
            item.Product_Subcategory === productDetails.Product_Subcategory &&
            Number(item.MRP || 0) >= minPrice &&
            Number(item.MRP || 0) <= maxPrice
        )
      );
    }

    // 5️⃣ Same Category
    if (related.length < 10) {
      addProducts(
        allProducts.filter(
          (item) =>
            item.Product_Category === productDetails.Product_Category
        )
      );
    }

    setRecommendations(related.slice(0, 10));

    setLoadingRecommendations(false);

  }, [productDetails, allProducts]);

  useEffect(() => {
    const pendingItem = localStorage.getItem("pendingCartItem");

    if (pendingItem && user) {
      const parsedItem = JSON.parse(pendingItem);

      if (Number(parsedItem?.MRP || 0) > 0) {
        dispatch(addToCart(parsedItem));
        setToastMsg("Item added after login ✅");
        setShowToast(true);
      }

      localStorage.removeItem("pendingCartItem");
    }
  }, [user, dispatch]);

  function addtocart() {
    if (isZeroPrice) {
      setToastMsg("This item is not available for purchase ❌");
      setShowToast(true);
      return;
    }

    if (isOutOfStock) {
      setToastMsg(
        "This product is currently out of stock. You can save it to your Wishlist ❤️"
      );
      setShowToast(true);
      return;
    }

    if (!user) {
      localStorage.setItem(
        "pendingCartItem",
        JSON.stringify({
          ...productDetails,
          quantity: Number(quantity),
        })
      );

      window.openLoginPopup?.();
      return;
    }

    dispatch(
      addToCart({
        ...productDetails,
        quantity: Number(quantity),
      })
    );

    window.showNotification(
      "Added to Cart",
      "success"
    );
  }

  function handleRecommendedAddToCart(e, item) {
    e.preventDefault();
    e.stopPropagation();

    if (Number(item?.Product_price || 0) <= 0) {
      setToastMsg("This item is not available for purchase ❌");
      setShowToast(true);
      return;
    }

    if (!isValidProduct(item)) {
      setToastMsg(
        "This product is currently out of stock. Save it to your Wishlist ❤️"
      );
      setShowToast(true);
      return;
    }

    if (!user) {
      localStorage.setItem(
        "pendingCartItem",
        JSON.stringify({
          ...item,
          quantity: 1,
        })
      );

      window.openLoginPopup?.();
      return;
    }

    dispatch(
      addToCart({
        ...item,
        quantity: 1,
      })
    );

    window.showNotification(
      "Added to Cart",
      "success"
    );
  }

  function addtowishlist() {
    if (!user) {
      window.openLoginPopup?.();
      return;
    }

    dispatch(addToWishlist(productDetails));

    window.showNotification(
      "Added to Wishlist",
      "success"
    );
  }



  if (loading) {
    return <LoadingIcon />;
  }

  if (!productDetails) {
    return <h2 style={{ textAlign: "center" }}>No Product Found</h2>;
  }

  const images = [
    productDetails.image_01,
    productDetails.image_02,
    productDetails.image_03,
    productDetails.image_04,
    productDetails.image_05,
  ].filter(validImage);

  console.log(productDetails);
  return (
    <>
      <div className="pro-breadcrumb">
        <Link to="/">Home</Link> / <span>Product Details</span>
      </div>

      <div className="pro-container">
        <div className="pro-left">
          <div className="pro-thumbnails">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
                className={mainImage === img ? "active-thumb" : ""}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>

          <div className="pro-main-image">
            <img
              src={mainImage || productDetails.image_01 || "/no-image.png"}
              alt="main"
            />
          </div>
        </div>

        <div className="pro-right">
          <h4 className="pro-brand">{productDetails.Brand_Name}</h4>

          {productDetails.Model_number && (
            <p className="pro-model">Model: {productDetails.Model_number}</p>
          )}

          <p className="pro-type">{productDetails.Product_Subcategory}</p>

          <h2 className="pro-title">{productDetails.Product_Name}</h2>

          <div className="pro-price-box">
            <span className="pro-price">
              ₹{formatPrice(productDetails?.MRP)}
            </span>
          </div>

          <div className="pro-quantity">
            <p>Quantity</p>

            <div className="qty-box">
              <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => {
                  if (stock > 0 && quantity >= stock) return;
                  setQuantity(quantity + 1);
                }}
                disabled={stock > 0 && quantity >= stock}
              >
                +
              </button>
            </div>

            {isOutOfStock && <p style={{ color: "red" }}>Out of Stock</p>}
          </div>

          <div className="pro-buttons">
            <button
              className="btn-cart"
              onClick={addtocart}
              disabled={disableAddToCart}
            >
              {isOutOfStock ? (
                "Out of Stock"
              ) : isZeroPrice ? (
                "Not Available"
              ) : (
                <>
                  <FaCartPlus /> Add to Cart
                </>
              )}
            </button>

            <button className="btn-buy" onClick={addtowishlist}>
              {wishlistItems.some(
                (w) =>
                  String(w.product_id || w._id || w.id) ===
                  String(getProductId(productDetails))
              ) ? (
                <IoIosHeart />
              ) : (
                <IoIosHeartEmpty />
              )}
              Wishlist
            </button>
          </div>

          <div className="pro-description">
            <h3>Description</h3>
            <p>{productDetails.Product_Discripction}</p>
          </div>
        </div>
      </div>

      {loadingRecommendations && (
        <h3 style={{ textAlign: "center", marginTop: "40px" }}>
          Loading Recommendations...
        </h3>
      )}

      {!loadingRecommendations && recommendations.length > 0 && (
        <div className="related-products-section">
          <div className="related-heading">
            <span></span>
            <h2>Recommended For You</h2>
            <span></span>
          </div>

          <p className="related-subtitle">
            Related products you may be interested in
          </p>

          <div className="related-wrapper">


            <div className="related-slider">
              {recommendations.map((item) => {
                const isWishlisted = wishlistItems.some(
                  (w) =>
                    String(w.product_id || w._id || w.id) ===
                    String(getProductId(item))
                );
                console.log(item);
                return (
                  <Link
                    to={`/productDetails/${getProductId(item)}`}
                    state={item}
                    className="ecom-product-card"
                    key={getProductId(item)}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    <div className="ecom-product-img">

                      <div
                        className={`wishlist-box ${isWishlisted ? "active" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          if (isWishlisted) {
                            dispatch(removeFromWishlist(getProductId(item)));

                            window.showNotification(
                              "Removed from Wishlist",
                              "info"
                            );
                          } else {
                            dispatch(
                              addToWishlist({
                                ...item,
                                product_id: getProductId(item),
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
                        src={item.image_01 || "/no-image.png"}
                        alt={item.Product_Name}
                      />

                      <button
                        type="button"
                        className="related-add-to-cart-btn"
                        disabled={!isValidProduct(item)}
                        onClick={(e) => handleRecommendedAddToCart(e, item)}
                      >
                        {isValidProduct(item) ? (
                          <>
                            <FaCartPlus /> Add to Cart
                          </>
                        ) : (
                          "Out of Stock"
                        )}
                      </button>

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
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      )}

      <Toast message={toastMsg} show={showToast} setShow={setShowToast} />
    </>
  );
}