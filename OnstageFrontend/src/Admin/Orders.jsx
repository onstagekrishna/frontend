import React, { useEffect, useState } from "react";

const BASE_URL = "https://api.onstage.co.in/api/v1";

export default function Orders() {
  const [paidOrders, setPaidOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("paid");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        console.log("TOKEN:", token);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [paidRes, pendingRes] = await Promise.all([
          fetch(`${BASE_URL}/paidOrder`, {
            method: "GET",
            headers,
            credentials: "include",
          }),

          fetch(`${BASE_URL}/pending-order-user`, {
            method: "GET",
            headers,
            credentials: "include",
          }),
        ]);

        const paidData = await paidRes.json();
        const pendingData = await pendingRes.json();

        console.log("Paid Data:", paidData);
        console.log("Pending Data:", pendingData);
        console.log("Pending Users:", pendingData.users);

        setUsers(pendingData.users || []);



        setPaidOrders(
          paidData.orders ||
          paidData.data ||
          paidData.paidOrders ||
          paidData.order ||
          []
        );

        setPendingOrders(
          pendingData.orders ||
          pendingData.data ||
          pendingData.pendingOrders ||
          pendingData.order ||
          pendingData.pendingOrder ||
          []
        );
      } catch (error) {
        console.error("Orders error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const currentOrders = activeTab === "paid" ? paidOrders : pendingOrders;

  return (
    <div className="onord-page">
      <div className="onord-header">
        <div>
          <h1>Orders</h1>
          <p>Manage all customer paid and pending orders here.</p>
        </div>
      </div>

      <div className="onord-stats">
        <div className="onord-card">
          <h4>PAID ORDERS</h4>
          <h2>{loading ? "..." : paidOrders.length}</h2>
        </div>

        <div className="onord-card">
          <h4>PENDING ORDERS</h4>
          <h2>{loading ? "..." : pendingOrders.length}</h2>
        </div>


        <div className="onord-card">
          <h4>TOTAL ORDERS</h4>
          <h2>{loading ? "..." : paidOrders.length + pendingOrders.length}</h2>
        </div>
      </div>

      <div className="onord-tabs">
        <button
          className={activeTab === "paid" ? "active" : ""}
          onClick={() => setActiveTab("paid")}
        >
          Paid Orders
        </button>

        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending Orders
        </button>
      </div>

      <div className="onord-table-box">
        {loading ? (
          <div className="onord-empty">Loading orders...</div>
        ) : currentOrders.length > 0 ? (
          <div className="onord-table-wrap">
            <table className="onord-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Email / Phone</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Qty 104</th>
                  <th>Qty 18</th>
                  <th>Warehouse Qty</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {currentOrders.map((order, index) => {

                  const customerName =
                    `${order.customerFirstName || ""} ${order.customerLastName || ""}`.trim() || "N/A";

                  const contact =
                    order.customerEmail ||
                    order.customerPhone ||
                    "N/A";

                  const orderId =
                    order.orderId ||
                    order.razorpayOrderId ||
                    order._id ||
                    "N/A";

                  const amount =
                    order.totalAmount ||
                    order.amount ||
                    0;

                  const shippingAddress = order.shippingAddress || {};

                  const addressText =
                    shippingAddress.fullAddress ||
                    `${shippingAddress.houseNo || ""} ${shippingAddress.street || ""
                      } ${shippingAddress.landMark || ""} ${shippingAddress.state || ""
                      }`.trim() ||
                    "N/A";

                  return (
                    <tr key={order._id || index}>
                      <td>{index + 1}</td>
                      <td>{customerName}</td>
                      <td>{contact}</td>
                      <td>{orderId}</td>
                      <td>₹{amount}</td>

                      <td>
                        {order.products?.length > 0 ? (
                          order.products.map((item, i) => (
                            <div key={i}>
                              {item.Product_Quantity_104 || 0}
                            </div>
                          ))
                        ) : (
                          0
                        )}
                      </td>

                      <td>
                        {order.products?.length > 0 ? (
                          order.products.map((item, i) => (
                            <div key={i}>
                              {item.Product_Quantity_18 || 0}
                            </div>
                          ))
                        ) : (
                          0
                        )}
                      </td>

                      <td>
                        {order.products?.length > 0 ? (
                          order.products.map((item, i) => (
                            <div key={i}>
                              {item.Product_Quantity_Warehouse || 0}
                            </div>
                          ))
                        ) : (
                          0
                        )}
                      </td>

                      <td
                        style={{
                          maxWidth: "280px",
                          minWidth: "250px",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {addressText}
                      </td>

                      <td>{order.status}</td>

                      <td>
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
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