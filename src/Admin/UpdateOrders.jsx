import React, { useEffect, useState } from "react";

const BASE_URL = "https://api.onstage.co.in/api/v1";

export default function UpdateOrders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const statusOptions = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const getToken = () => localStorage.getItem("token");

  const getHeaders = () => ({
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

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/paidOrder`, {
        method: "GET",
        headers: getHeaders(),
        credentials: "include",
      });

      const data = await res.json();
      console.log("data: ", data);

      if (!res.ok || data.success === false) {
        setOrders([]);
        notify(data.message || "Failed to fetch orders", "error");
        return;
      }

      const orderList = Array.isArray(data.orders)
        ? data.orders
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.paidOrders)
            ? data.paidOrders
            : Array.isArray(data.order)
              ? data.order
              : [];

      // Sirf Paid orders
      const paidOrders = orderList
        .filter(
          (order) => String(order.paymentStatus).toLowerCase() === "paid"
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(paidOrders);

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      console.error("Fetch orders error:", error);
      notify("Something went wrong while fetching orders", "error");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      const res = await fetch(`${BASE_URL}/update-order-user/${orderId}`, {
        method: "PUT",
        headers: getHeaders(),
        credentials: "include",
        body: JSON.stringify({
          orderId,
          status
        }),
      });

      const data = await res.json();

      console.log("Status Updated:", data);

      if (res.ok || data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );

        notify(`Order status updated to ${status}`, "success");
      } else {
        notify(data.message || "Status update failed", "error");
      }
    } catch (error) {
      console.error("Update status error:", error);
      notify("Something went wrong", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "pending") return "pending";
    if (value === "processing") return "processing";
    if (value === "shipped") return "shipped";
    if (value === "delivered") return "delivered";
    if (value === "cancelled" || value === "canceled") return "cancelled";

    return "pending";
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  return (
    <div className="onord-page">
      <div className="onord-header">
        <div>
          <h1>Update Orders</h1>
          <p className="adm-subtitle">
            Manage and update order delivery status.
          </p>
        </div>
      </div>

      <div className="onord-table-box">
        {loading ? (
          <div className="onord-empty">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="onord-table-wrap">
            <table className="onord-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Email / Phone</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Order Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => {
                  const userId =
                    typeof order.user === "object"
                      ? order.user?._id
                      : order.user;

                  const matchedUser =
                    users.find((u) => u._id === userId) ||
                    order.user ||
                    {};

                  const customerName =
                    `${matchedUser.firstName || ""} ${matchedUser.lastName || ""
                      }`.trim() ||
                    order.customerName ||
                    order.name ||
                    "N/A";

                  const contact =
                    matchedUser.email ||
                    matchedUser.contactNumber ||
                    order.email ||
                    order.phone ||
                    "N/A";

                  const orderId =
                    order.orderId ||
                    order.razorpayOrderId ||
                    order._id ||
                    "N/A";

                  const amount = order.totalAmount || order.amount || 0;

                  return (
                    <tr key={order._id || index}>
                      <td>{index + 1}</td>
                      <td>{customerName}</td>
                      <td>{contact}</td>
                      <td>{orderId}</td>
                      <td>₹{formatAmount(amount)}</td>

                      <td>
                        <select
                          value={order.status || "Pending"}
                          disabled={updatingId === order._id}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className={`onord-status-select ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                            "en-IN"
                          )
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="onord-empty">No orders found</div>
        )}
      </div>
    </div>
  );
}