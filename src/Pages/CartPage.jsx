import { useSelector, useDispatch } from "react-redux";
import ConfirmPopup from "../Component/ConfirmPopup";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { addToWishlist, removeFromWishlist, } from "../Redux/Slices/WishlistSlice";
import {
  remove,
  increaseQty,
  decreaseQty,
} from "../Redux/Slices/CartSlice";
import { useState } from "react";

export default function CartPage() {
  const cartItems = useSelector((state) => state.Cart?.items || []);
  const wishlistItems = useSelector(
    (state) => state.Wishlist?.items || []
  );

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const formatPrice = (price) =>
    Math.round(Number(price || 0)).toLocaleString("en-IN");

  const totalMRP = cartItems.reduce((total, item) => {
    const price = parseFloat(item.MRP || item.Product_price);
    const qty = Number(item.quantity) || 1;

    if (isNaN(price)) return total;

    return total + price * qty;
  }, 0);

  const shipping = 0;
  const finalAmount = totalMRP - discount;

  const applyCoupon = () => {
    if (coupon === "ONSTAGE10") {
      setDiscount(totalMRP * 0.1);
    } else if (coupon === "ONSTAGE20") {
      setDiscount(totalMRP * 0.2);
    } else {
      alert("Invalid Coupon ❌");
      setDiscount(0);
    }
  };

  const handlePlaceOrder = () => {
    if (!user) {
      // alert("Please login first");
      window.openLoginPopup?.();
      return;
    }

    navigate("/address");
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <img
          src="https://res.cloudinary.com/dfilhi9ku/image/upload/v1758883524/Onstage-Loading_b1big3.gif"
          alt="Empty Cart"
          className="empty-cart-gif"
        />

        <h2 className="empty-title">Your Cart is Empty</h2>

        <p className="empty-desc">
          Looks like you haven’t added anything yet
        </p>

        <button
          className="shop-now-btn"
          onClick={() => navigate("/")}
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="site-container">

        <div className="cart-container">

          <div className="cart-left">
            {cartItems.map((item) => {
              const stock = Number(item.Product_Quantity || 0);
              const price = parseFloat(item.Product_price);

              if (isNaN(price)) return null;
              const isWishlisted = wishlistItems.some(
                (w) =>
                  String(w.product_id || w._id || w.id) ===
                  String(item.product_id)
              );
              return (
                <div className="cart-item" key={item.product_id}>

                  <div className="cart-img">
                    <img
                      src={item.image_01}
                      alt={item.Product_Name}
                    />
                  </div>

                  <div className="cart-details">

                    <h3 className="cart-brand">
                      {item.Brand_Name}
                    </h3>

                    <p className="model-brand-colour">
                      Model - {item.Model_number || "N/A"}
                    </p>

                    <p className="cart-category">
                      {item.Product_Category ||
                        item.Product_Subcategory ||
                        "Category"}
                    </p>

                    <div className="cart-price">
                      <span>MRP ₹{formatPrice(item.MRP)}</span>

                      {Number(item.Product_price) > 0 && (
                        <del>
                          ₹{formatPrice(item.Product_price)}
                        </del>
                      )}
                    </div>

                    <div className="cart-footer">

                      <div className="qty">

                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              setSelectedId(item.product_id);
                              setShowPopup(true);
                              return;
                            }

                            dispatch(decreaseQty(item.product_id));
                          }}
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          disabled={item.quantity >= stock}
                          className={item.quantity >= stock ? "disabled-btn" : ""}
                          onClick={() => dispatch(increaseQty(item.product_id))}
                        >
                          +
                        </button>

                      </div>

                      <div className="cart-actions">

                        <button
                          className="cart-heart"
                          title="Wishlist"
                          onClick={(e) => {
                            e.stopPropagation();

                            if (isWishlisted) {
                              dispatch(removeFromWishlist(item.product_id));
                              window.showNotification?.("Removed from Wishlist", "info");
                            } else {
                              dispatch(
                                addToWishlist({
                                  ...item,
                                  product_id: item.product_id,
                                })
                              );
                              window.showNotification?.("Moved to Wishlist", "success");
                            }
                          }}
                        >
                          {isWishlisted ? (
                            <IoIosHeart className="wishlist-icon filled" />
                          ) : (
                            <IoIosHeartEmpty className="wishlist-icon" />
                          )}
                        </button>

                        <button
                          className="cart-delete"
                          title="Remove"
                          onClick={() => {
                            setSelectedId(item.product_id);
                            setShowPopup(true);
                          }}
                        >
                          <MdDelete />
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}
          </div>

          <div className="cart-right">

            <div className="secure-box">
              <FaLock />
              <span>100% Secure Checkout</span>
            </div>

            <div className="product-summary">

              <h3>Order Summary</h3>

              {cartItems.map((item) => {
                const price = parseFloat(
                  item.MRP || item.Product_price
                );

                const qty = Number(item.quantity) || 1;

                if (isNaN(price)) return null;

                return (
                  <div
                    key={item.product_id}
                    className="summary-row"
                  >
                    <span>
                      {item.Product_Name} × {qty}
                    </span>

                    <span>
                      ₹{formatPrice(price * qty)}
                    </span>
                  </div>
                );
              })}

            </div>

            <h3>Apply Coupon</h3>

            <div className="coupon">
              <input
                value={coupon}
                onChange={(e) =>
                  setCoupon(e.target.value)
                }
                placeholder="Enter Coupon"
              />

              <button onClick={applyCoupon}>
                Apply
              </button>
            </div>

            <div className="billing-box">

              <h3>BILLING DETAILS</h3>

              <div className="bill-row">
                <span>Cart Total</span>
                <span>₹{formatPrice(totalMRP)}</span>
              </div>

              <div className="bill-row">
                <span>Shipping</span>

                <span>
                  {shipping === 0
                    ? "Free Delivery"
                    : `₹${formatPrice(shipping)}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="bill-row">
                  <span>Discount</span>
                  <span>
                    -₹{formatPrice(discount)}
                  </span>
                </div>
              )}

              <hr />

              <div className="bill-row total">
                <span>Total Payable</span>
                <span>
                  ₹{formatPrice(finalAmount)}
                </span>
              </div>

            </div>

            <button
              className="order-btn"
              onClick={handlePlaceOrder}
            >
              PLACE ORDER
            </button>

          </div>

        </div>

      </div>

      <ConfirmPopup
        show={showPopup}
        title="Remove from Cart"
        message="Are you sure you want to remove this item from your cart?"
        onConfirm={() => {
          dispatch(remove(selectedId));
          setShowPopup(false);
        }}
        onCancel={() => setShowPopup(false)}
      />
    </>
  );
}