import React, { useEffect, useState } from "react";

const BASE_URL = "https://api.onstage.co.in/api/v1";

export default function RefundedOrder() {
  const [refundOrders, setRefundOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRefundOrders();
  }, []);

  const fetchRefundOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/refundedOrder`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      console.log("Refund Orders:", data);

      setRefundOrders(
        data.orders ||
          data.data ||
          data.refundedOrders ||
          data.refundOrders ||
          data.order ||
          []
      );
    } catch (error) {
      console.error("Refund order error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onord-page">
      <div className="onord-header">
        <div>
          <h1>Refund Orders</h1>
          <p className="adm-subtitle">
            Manage all refunded customer orders here.
          </p>
        </div>
      </div>

      <div className="onord-table-box">
        {loading ? (
          <div className="onord-empty">Loading refund orders...</div>
        ) : refundOrders.length > 0 ? (
          <div className="onord-table-wrap">
            <table className="onord-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Email / Phone</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {refundOrders.map((order, index) => {
                  const user =
                    typeof order.user === "object" ? order.user : {};

                  const customerName =
                    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                    order.customerName ||
                    order.name ||
                    "N/A";

                  const contact =
                    user.email ||
                    user.contactNumber ||
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
                      <td>₹{amount}</td>
                      <td>{order.status || "Refunded"}</td>
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
          <div className="onord-empty">No refund orders found</div>
        )}
      </div>
    </div>
  );
}