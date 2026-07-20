import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AddressPage() {
  const cartItems = useSelector((state) => state.Cart?.items || []);
  const authUser = useSelector((state) => state.auth.user);
  const reduxToken = useSelector((state) => state.auth.token);

  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    house: "",
    address: "",
    landmark: "",
    pincode: "",
    type: "Home",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("addresses")) || [];
    setAddresses(saved);

    if (saved.length > 0) {
      setShowForm(false);
      setSelectedIndex(0);
    }
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getStoredUser = () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address || !form.pincode) {
      window.showNotification
        ? window.showNotification("Fill required fields", "error")
        : alert("Fill required fields");
      return;
    }

    let updated = [...addresses];

    if (editIndex !== null) {
      updated[editIndex] = form;
      setSelectedIndex(editIndex);
    } else {
      updated.push(form);
      setSelectedIndex(updated.length - 1);
    }

    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));

    setShowForm(false);
    setEditIndex(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      house: "",
      address: "",
      landmark: "",
      pincode: "",
      type: "Home",
    });
  }

  function handleEdit(index) {
    setForm(addresses[index]);
    setEditIndex(index);
    setShowForm(true);
  }

  function handleDelete(index) {
    const updated = addresses.filter((_, i) => i !== index);

    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));

    if (updated.length === 0) {
      setSelectedIndex(null);
      setShowForm(true);
    } else {
      setSelectedIndex(0);
    }
  }

  const total = cartItems.reduce(
    (t, i) => t + Number(i.MRP || i.Product_price || 0) * Number(i.quantity || 1),
    0
  );

  const payableAmount = Math.round(total);

  const formatPrice = (price) =>
    Number(price).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });

  const selectedAddress =
    selectedIndex !== null ? addresses[selectedIndex] : null;

  const handlePayment = async () => {
    if (paymentLoading) return;

    const storedUser = getStoredUser();
    // const userId = authUser?._id || storedUser?._id;
    const userId =
      authUser?._id ||
      authUser?.user?._id ||
      storedUser?._id ||
      storedUser?.user?._id;
    const authToken = reduxToken || localStorage.getItem("token");

    console.log("========== TOKEN DEBUG ==========");
    console.log("TOKEN:", authToken);
    console.log("REDUX TOKEN:", reduxToken);
    console.log("LOCAL TOKEN:", localStorage.getItem("token"));
    console.log("USER:", localStorage.getItem("user"));

    console.log("========== USER DATA ==========");
    console.log("authUser:", authUser);
    console.log("storedUser:", storedUser);
    console.log("userId:", userId);
    console.log("authToken:", authToken);
    console.log("cartItems:", cartItems);
    console.log("selectedAddress:", selectedAddress);

    if (!userId) {
      window.showNotification
        ? window.showNotification("Please login first", "error")
        : alert("Please login first");

      navigate("/login");
      return;
    }

    if (!selectedAddress) {
      window.showNotification
        ? window.showNotification("Please select address", "error")
        : alert("Please select address");
      return;
    }

    if (cartItems.length === 0) {
      window.showNotification
        ? window.showNotification("Cart is empty", "error")
        : alert("Cart is empty");
      return;
    }

    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      window.showNotification
        ? window.showNotification("Razorpay script failed to load", "error")
        : alert("Razorpay script failed to load");
      return;
    }

    try {
      setPaymentLoading(true);

      const payload = {
        userId,
        amount: payableAmount,
        cartItems,
        shippingAddress: {
          houseNo: selectedAddress.house || "",
          street: selectedAddress.address || "",
          landMark: selectedAddress.landmark || "",
          state: selectedAddress.state || "UP",
          country: selectedAddress.country || "India",
          fullAddress: `${selectedAddress.house || ""} ${selectedAddress.address || ""}`,
        },
        cartTotal: payableAmount,
        gst: 0,
        totalAmount: payableAmount,
      };

      console.log("========== REQUEST BODY ==========");
      console.log(payload);

      const orderRes = await fetch(
        "https://api.onstage.co.in/api/v1/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include",
          body: JSON.stringify({
            userId: userId,

            amount: payableAmount,
            cartItems,

            shippingAddress: {
              houseNo: selectedAddress.house || "",
              street: selectedAddress.address || "",
              landMark: selectedAddress.landmark || "",
              state: selectedAddress.state || "UP",
              country: selectedAddress.country || "India",
              fullAddress: `${selectedAddress.house || ""} ${selectedAddress.address || ""}`,
            },

            cartTotal: payableAmount,
            gst: 0,
            totalAmount: payableAmount,
          }),
        }
      );

      console.log("STATUS:", orderRes.status);
      console.log("OK:", orderRes.ok);

      const orderData = await orderRes.json();
      console.log("ORDER DATA:", orderData);

      if (!orderRes.ok || (!orderData.success && !orderData.sucess)) {
        window.showNotification
          ? window.showNotification(
            orderData.message || "Order creation failed",
            "error"
          )
          : alert(orderData.message || "Order creation failed");
        return;
      }

      const razorpayOrder = orderData.order || orderData.data || {};

      const options = {
        key: "rzp_test_SbiVD7Q7wXtWMV",
        amount: razorpayOrder.amount || payableAmount * 100,
        currency: razorpayOrder.currency || "INR",
        name: "OnStage",
        description: "Order Payment",
        order_id:
          razorpayOrder.id ||
          orderData.razorpayOrderId ||
          orderData.orderId,


        handler: function (response) {
          console.log("Payment Success:", response);

          window.showNotification?.(
            "Payment Successful",
            "success"
          );

          navigate("/");
        },

        prefill: {
          name: selectedAddress.name || "",
          email: selectedAddress.email || authUser?.email || storedUser?.email || "",
          contact: selectedAddress.phone || authUser?.contactNumber || "",
        },

        theme: {
          color: "#f59e0b",
        },
      };

      console.log("RAZORPAY OPTIONS:", options);

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log("PAYMENT ERROR:", error);

      window.showNotification
        ? window.showNotification("Payment failed", "error")
        : alert("Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="ck-container">
      <div className="ck-steps">
        <span onClick={() => navigate("/cart")}>CART</span>
        <span className="active">ADDRESS</span>
        <span>PAYMENT</span>
      </div>

      <div className="ck-main">
        <div className="ck-left">
          {!showForm && (
            <>
              {addresses.map((addr, i) => (
                <div
                  key={i}
                  className={`ck-card ${selectedIndex === i ? "active" : ""}`}
                  onClick={() => setSelectedIndex(i)}
                >
                  <div className="ck-select">
                    {selectedIndex === i ? "🎸" : ""}
                  </div>

                  <div className="ck-content">
                    <div className="ck-top">
                      <strong>{addr.name}</strong>
                      <span className="ck-type">{addr.type}</span>
                    </div>

                    <p>{addr.phone}</p>

                    <p>
                      {addr.house}, {addr.address}
                    </p>

                    <p>{addr.pincode}</p>
                  </div>

                  <div className="ck-actions">
                    <FaEdit
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(i);
                      }}
                    />

                    <FaTrash
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(i);
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="ck-add" onClick={() => setShowForm(true)}>
                + Add New Address
              </div>
            </>
          )}

          {showForm && (
            <form className="ck-form" onSubmit={handleSave}>
              <h3>{editIndex !== null ? "Edit Address" : "Add Address"}</h3>

              <input
                name="name"
                placeholder="Full Name*"
                value={form.name}
                onChange={handleChange}
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />

              <input
                name="phone"
                placeholder="Mobile*"
                value={form.phone}
                onChange={handleChange}
              />

              <input
                name="house"
                placeholder="House No*"
                value={form.house}
                onChange={handleChange}
              />

              <textarea
                name="address"
                placeholder="Full Address*"
                value={form.address}
                onChange={handleChange}
              />

              <input
                name="landmark"
                placeholder="Landmark"
                value={form.landmark}
                onChange={handleChange}
              />

              <input
                name="pincode"
                placeholder="Pincode*"
                value={form.pincode}
                onChange={handleChange}
              />

              <div className="ck-radio">
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="Home"
                    checked={form.type === "Home"}
                    onChange={handleChange}
                  />
                  Home
                </label>

                <label>
                  <input
                    type="radio"
                    name="type"
                    value="Office"
                    checked={form.type === "Office"}
                    onChange={handleChange}
                  />
                  Office
                </label>
              </div>

              <button type="submit">
                {editIndex !== null ? "Update Address" : "Save Address"}
              </button>
            </form>
          )}
        </div>

        <div className="ck-right">
          {!showForm && selectedAddress && (
            <div className="selected-address-box">
              <h3>DELIVERY ADDRESS</h3>

              <div className="selected-address-content">
                <p>
                  <strong>{selectedAddress.name}</strong>
                </p>

                <p>{selectedAddress.phone}</p>

                <p>
                  {selectedAddress.house}, {selectedAddress.address}
                </p>

                {selectedAddress.landmark && <p>{selectedAddress.landmark}</p>}

                <p>{selectedAddress.pincode}</p>

                <span className="address-type-badge">
                  {selectedAddress.type}
                </span>
              </div>
            </div>
          )}

          <h3>BILLING DETAILS</h3>

          <div className="ck-row">
            <span>Cart Total</span>
            <span>₹{formatPrice(total)}</span>
          </div>

          <div className="ck-row">
            <span>Shipping</span>
            <span>Free Delivery</span>
          </div>

          <div className="ck-row total">
            <span>Total Payable</span>
            <span>₹{formatPrice(payableAmount)}</span>
          </div>

          {!showForm && selectedAddress && (
            <button
              className="ck-btn"
              onClick={handlePayment}
              disabled={paymentLoading}
            >
              {paymentLoading ? "Processing..." : "PLACE ORDER"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}