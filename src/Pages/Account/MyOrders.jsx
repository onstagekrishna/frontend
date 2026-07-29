import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiCancel } from "react-icons/gi";
import { FaStar } from "react-icons/fa";

const API = "https://api.onstage.co.in/api/v1";

export default function MyOrders() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("History");
  const [statusFilter, setStatusFilter] = useState("All");

  const [orders, setOrders] = useState([]);
  const [yourOrders, setYourOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [failedOrders, setFailedOrders] = useState([]);
  const [statusOrders, setStatusOrders] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [review, setReview] = useState("");

  const getToken = () => localStorage.getItem("token");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  const notify = (message, type = "success") => {
    if (window.showNotification) {
      window.showNotification(message, type);
    } else {
      alert(message);
    }
  };

  const getArrayData = (data) => data?.orders || data?.data || [];

  const sortLatestFirst = (arr) => {
    return [...arr].sort(
      (a, b) =>
        new Date(b.createdAt || b.created_at || b.updatedAt || 0) -
        new Date(a.createdAt || a.created_at || a.updatedAt || 0)
    );
  };

  const formatText = (value) => {
    if (!value) return "N/A";
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
  };

  const fetchOrders = async (url, setter, label) => {
    try {
      setLoading(true);

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      const data = await res.json();
      console.log(label, data);

      if (!res.ok || data.success === false) {
        setter([]);
        return;
      }

      setter(sortLatestFirst(getArrayData(data)));
    } catch (err) {
      console.log(`${label} Error:`, err);
      setter([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchYourOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/order-history`, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      const data = await res.json();

      console.log("Your Orders:", data);

      if (!res.ok || data.success === false) {
        setYourOrders([]);
        return;
      }

      const pendingOrders = getArrayData(data).filter((order) => {
        const status = String(order.status || "").toLowerCase();
        return status === "pending";
      });

      setYourOrders(sortLatestFirst(pendingOrders));
    } catch (error) {
      console.log("Your Orders Error:", error);
      setYourOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveredOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/order-history`, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setDeliveredOrders([]);
        return;
      }

      const delivered = getArrayData(data).filter((order) => {
        const status = String(order.status || "").toLowerCase();
        return status === "delivered";
      });

      setDeliveredOrders(sortLatestFirst(delivered));
    } catch (error) {
      console.log("Delivered Orders Error:", error);
      setDeliveredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusOrders = async () => {
    try {
      setLoading(true);

      const [historyRes, yourOrderRes] = await Promise.all([
        fetch(`${API}/order-history`, {
          method: "GET",
          credentials: "include",
          headers: authHeaders(),
        }),
        fetch(`${API}/your-order`, {
          method: "GET",
          credentials: "include",
          headers: authHeaders(),
        }),
      ]);

      const historyData = await historyRes.json();
      const yourOrderData = await yourOrderRes.json();

      const historyOrders = getArrayData(historyData);
      const paidOrders = getArrayData(yourOrderData);

      const allOrders = [...historyOrders, ...paidOrders];

      const uniqueOrders = allOrders.filter(
        (order, index, self) =>
          index ===
          self.findIndex(
            (item) =>
              (item._id || item.id || item.orderId) ===
              (order._id || order.id || order.orderId)
          )
      );

      const statusData = uniqueOrders.map((order) => ({
        ...order,
        displayStatus:
          order.orderStatus ||
          order.deliveryStatus ||
          order.status ||
          order.paymentStatus ||
          "Processing",
      }));

      setStatusOrders(sortLatestFirst(statusData));
    } catch (error) {
      console.log("Status Orders Error:", error);
      setStatusOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter === "History") {
      fetchOrders(`${API}/order-history`, setOrders, "History");
    }

    if (filter === "Your Order") {
      fetchYourOrders();
    }

    if (filter === "Delivered") {
      fetchDeliveredOrders();
    }

    if (filter === "Failed Order") {
      fetchOrders(`${API}/fail-order`, setFailedOrders, "Failed Order");
    }

    if (filter === "Order Status") {
      fetchStatusOrders();
    }
  }, [filter]);

  const getOrderStatus = (order) => {
    return (
      order.displayStatus ||
      order.orderStatus ||
      order.deliveryStatus ||
      order.status ||
      order.paymentStatus ||
      "Processing"
    );
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value.includes("pending")) return "pending";
    if (value.includes("processing")) return "processing";
    if (value.includes("shipped")) return "shipped";
    if (value.includes("delivered")) return "delivered";
    if (value.includes("cancelled") || value.includes("canceled"))
      return "cancelled";
    if (value.includes("failed")) return "failed";
    if (value.includes("paid") || value.includes("success"))
      return "processing";

    return "processing";
  };

  const getDisplayStatus = (order) => {
    const status = getOrderStatus(order);
    const statusText = String(status || "").toLowerCase();

    if (filter === "Delivered") return "Delivered";

    if (statusText.includes("pending")) return "";
    if (statusText.includes("processing")) return "Processing";
    if (statusText.includes("shipped")) return "Shipped";
    if (statusText.includes("delivered")) return "Delivered";
    if (statusText.includes("cancelled") || statusText.includes("canceled"))
      return "Cancelled";

    if (statusText.includes("paid") || statusText.includes("success")) {
      return "Processing";
    }

    return status || "Processing";
  };

  let filteredOrders =
    filter === "History"
      ? orders
      : filter === "Your Order"
        ? yourOrders
        : filter === "Delivered"
          ? deliveredOrders
          : filter === "Failed Order"
            ? failedOrders
            : filter === "Order Status"
              ? statusOrders
              : [];

  if (filter === "Order Status" && statusFilter !== "All") {
    filteredOrders = filteredOrders.filter((order) => {
      const status = getDisplayStatus(order).toLowerCase();
      return status === statusFilter.toLowerCase();
    });
  }

  const getProductImage = (order) => {
    return (
      order.image ||
      order.productImage ||
      order.products?.[0]?.image_01 ||
      order.products?.[0]?.image ||
      order.product?.image_01 ||
      "https://res.cloudinary.com/dfilhi9ku/image/upload/v1758112097/Onstage-Logo-2019-2_2_pvggfn.png"
    );
  };

  const getProductTitle = (order) => {
    return (
      order.title ||
      order.name ||
      order.productName ||
      order.products?.[0]?.Model_number ||
      order.products?.[0]?.Product_Name ||
      order.product?.Model_number ||
      order.product?.Product_Name ||
      "Product Order"
    );
  };

  const getOrderPrice = (order) => {
    const price =
      order.price ||
      order.totalAmount / 100 ||
      order.amount / 100 ||
      order.amount ||
      order.totalPrice ||
      0;

    return Number(price).toLocaleString("en-IN");
  };

  const getOrderId = (order) => {
    return order._id || order.id || order.orderId;
  };

  const handleCancelOrder = async (orderId) => {

    if (!orderId) {
      notify("Order ID not found", "error");
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    console.log(orderId)
    if (!confirmCancel) return;

    try {
      const res = await fetch(`${API}/refund-user`, {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (data.success) {
        notify(data.message || "Order cancelled successfully", "success");

        if (filter === "History") {
          fetchOrders(`${API}/order-history`, setOrders, "History");
        }

        if (filter === "Your Order") {
          fetchYourOrders();
        }

        if (filter === "Delivered") {
          fetchDeliveredOrders();
        }

        if (filter === "Order Status") {
          fetchStatusOrders();
        }
      } else {
        notify(data.message || "Order cancel failed", "error");
      }
    } catch (error) {
      console.log("Cancel Order Error:", error);
      notify("Something went wrong", "error");
    }
  };

  const submitReview = async () => {
    try {

      console.log("REVIEW DATA =>", {
        productId: selectedProductId,
        rating,
        review,
      });

      const res = await fetch(`${API}/product-review`, {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify({
          Model_number: selectedProductId,
          rating,
          review,
        }),
      });

      const data = await res.json();

      if (data.success) {
        notify("Review Submitted Successfully", "success");

        setShowReviewModal(false);
        setSelectedProductId("");
        setReview("");
        setRating(0);
      } else {
        notify(data.message || "Review submit failed", "error");
      }
    } catch (error) {
      console.log(error);
      notify("Something went wrong", "error");
    }
  };

  const tabs = [
    "History",
    "Your Order",
    "Delivered",
    "Failed Order",
    "Order Status",
  ];

  return (
    <>
      <div className="account-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <span> / </span>
        <span className="active">My Orders</span>
      </div>

      <h2>My Orders</h2>

      <div className="account-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={filter === tab ? "active" : ""}
            onClick={() => {
              setFilter(tab);
              setStatusFilter("All");
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {filter === "Order Status" && (
        <div className="status-filter-wrapper">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter-select"
          >
            <option value="All">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No Orders Found</p>
      ) : (
        <div className="account-orders-scroll">
          {filteredOrders.map((order, i) => {
            const status = getOrderStatus(order);
            const statusClass = getStatusClass(status);
            const displayStatus = getDisplayStatus(order);

            return (
              <div
                key={getOrderId(order) || i}
                className="account-order-card"
              >
                <img src={getProductImage(order)} alt="Product" />

                <div className="account-order-info">
                  <span className={`account-status ${statusClass}`}>
                    {displayStatus}
                  </span>

                  <p className="title">{getProductTitle(order)}</p>

                  <h4>₹{getOrderPrice(order)}</h4>

                  {String(order.status || "").toLowerCase() !== "pending" && (
                    <p className="order-meta">
                      <strong>Status:</strong> {formatText(order.status)}
                    </p>
                  )}

                  {String(order.paymentStatus || "").toLowerCase() !== "pending" && (
                    <p className="order-meta">
                      <strong>Payment Status:</strong> {formatText(order.paymentStatus)}
                    </p>
                  )}

                  {filter === "Order Status" && (
                    <div className="order-status-track">
                      <span
                        className={
                          statusClass === "processing" ? "active" : ""
                        }
                      >
                        Processing
                      </span>

                      <span
                        className={statusClass === "shipped" ? "active" : ""}
                      >
                        Shipped
                      </span>

                      <span
                        className={
                          statusClass === "delivered" ? "active" : ""
                        }
                      >
                        Delivered
                      </span>

                      <span
                        className={
                          statusClass === "cancelled"
                            ? "active cancelled-status"
                            : ""
                        }
                      >
                        Cancelled
                      </span>
                    </div>
                  )}
                </div>

                <div className="account-order-actions">
                  {(statusClass === "pending" ||
                    statusClass === "processing") &&
                    filter !== "Delivered" &&
                    filter !== "Failed Order" && (
                      <button
                        className="cancel-order-btn"
                        onClick={() => handleCancelOrder(getOrderId(order))}
                      >
                        <GiCancel />
                        <span>Cancel Order</span>
                      </button>
                    )}

                  {displayStatus === "Delivered" && (
                    <button
                      className="review-btn"
                      onClick={() => {
                        setSelectedProductId(
                          order.products?.[0]?.Model_number
                        );
                        setShowReviewModal(true);
                      }}
                    >
                      ⭐ Write Review
                    </button>
                  )}

                  <div className="account-arrow">›</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showReviewModal && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <h3>Write Review</h3>

            <div className="review-stars-wrapper">
              <p className="review-label">
                How would you rate this product?
              </p>

              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={38}
                    className="review-star"
                    color={
                      star <= (hover || rating)
                        ? "#ffb400"
                        : "#e4e5e9"
                    }
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  />
                ))}
              </div>

              {rating > 0 && (
                <p className="selected-rating">
                  {rating} / 5 Stars
                </p>
              )}
            </div>

            <textarea
              className="review-textarea"
              rows="5"
              placeholder="Share your experience with this product..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <div className="review-actions">
              <button
                className="review-cancel-btn"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>

              <button
                className="review-submit-btn"
                onClick={submitReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}