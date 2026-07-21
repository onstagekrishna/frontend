import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../Redux/Slices/WishlistSlice";
import { addToCart } from "../Redux/Slices/CartSlice";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaStar } from "react-icons/fa";

export default function WishlistPage() {
  const wishlistItems = useSelector(
    (state) => state.Wishlist?.items || []
  );

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(wishlistItems)
  return (
    <div style={{ padding: "48px" }}>
      {wishlistItems.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ margin: 0 }}>Wishlist</h1>

          <img
            src="https://res.cloudinary.com/dfilhi9ku/image/upload/v1758883524/Onstage-Loading_b1big3.gif"
            alt="wishlist"
            style={{ width: "40px", height: "40px" }}
          />
        </div>
      )}

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <img
            src="https://res.cloudinary.com/dfilhi9ku/image/upload/v1758883524/Onstage-Loading_b1big3.gif"
            alt="empty wishlist"
            className="empty-gif"
          />

          <div className="content-add-to-cart">
            <h1>Your wishlist is empty.</h1>
            <p>
              Looks like you haven’t added anything yet. Start exploring and
              save your favorite items here.
            </p>

            <button
              onClick={() => navigate("/")}
              style={{
                marginTop: "5px",
                padding: "10px 20px",
                border: "none",
                background: "#ff9800",
                color: "#fff",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="ecom-products-grid">
          {wishlistItems.map((item) => {
            const brand = item?.Brand_Name || item?.brand || "Brand";

            const category =
              item?.Product_Category ||
              item?.Product_Subcategory ||
              item?.category ||
              "Category";

            const name = item?.Product_Name || "Product Name";

            const mrp = Number(item?.MRP || 0);

            const price = Number(
              item?.Product_price ||
              item?.Selling_price ||
              item?.Sale_price ||
              item?.price ||
              0
            );

            const image =
              item?.image_01 || item?.Product_Image || "/no-image.png";

            const id = item?.product_id || item?._id || item?.id;

            const stock = Number(item?.Product_Quantity || 0);
            const isOutOfStock = stock === 0;

            return (
              <div
                key={id}
                className="ecom-product-card"
                onClick={() =>
                  navigate(`/productDetails/${id}`, {
                    state: item,
                  })
                }
              >
                <div className="ecom-product-img">
                  <img src={image} alt={name} />

                  <div
                    className="wishlist-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromWishlist(id));
                    }}
                  >
                    <MdDelete />
                  </div>

                  {isOutOfStock ? (
                    <span className="stock-badge">Out of Stock</span>
                  ) : (
                    <button
                      className="related-add-cart"
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!user) {
                          window.showNotification("Please login first", "error");
                          window.openLoginPopup?.();
                          return;
                        }

                        dispatch(
                          addToCart({
                            ...item,
                            quantity: 1,
                            Product_Quantity: Number(item.Product_Quantity || 0),
                          })
                        );

                        window.showNotification(
                          "Product added to cart",
                          "success"
                        );
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>

                <div className="ecom-product-info">
                  <h5 className="ecom-brand">
                    {item?.Brand_Name || item?.brand}
                  </h5>

                  <p className="ecom-model">
                    Model - {item?.Model_number || "N/A"}
                  </p>

                  <p className="ecom-type">
                    {item?.Product_Category ||
                      item?.Product_Subcategory ||
                      item?.category}
                  </p>
                  <div className="ecom-price-box">
                    <span className="ecom-price">
                      MRP ₹{mrp.toLocaleString("en-IN")}
                    </span>

                    {Number(item.totalReviews || 0) > 0 && (
                      <span className="ecom-rating">
                        <FaStar className="rating-star" />
                        {Number(item.averageRating || 0).toFixed(1)} ({item.totalReviews})
                      </span>
                    )}

                    {price > mrp && (
                      <span className="ecom-old-price">
                        ₹{price.toLocaleString("en-IN")}
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
  );
} 
