import React, { useEffect, useMemo, useState } from "react";


const BASE_URL = "https://api.onstage.co.in/api/v1";

const ORDERS_PER_PAGE = 10;
const PRODUCTS_PER_PAGE = 10;

export default function Orders() {
  const [paidOrders, setPaidOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  const [activeTab, setActiveTab] = useState("paid");
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orderPage, setOrderPage] = useState(1);
  const [productPage, setProductPage] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

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

        const paid =
          paidData.orders ||
          paidData.data ||
          paidData.paidOrders ||
          paidData.order ||
          [];

        const pending =
          pendingData.orders ||
          pendingData.data ||
          pendingData.pendingOrders ||
          pendingData.order ||
          pendingData.pendingOrder ||
          [];

        setPaidOrders(
          [...paid].sort(
            (a, b) =>
              new Date(b.createdAt || b.updatedAt || 0) -
              new Date(a.createdAt || a.updatedAt || 0)
          )
        );

        setPendingOrders(
          [...pending].sort(
            (a, b) =>
              new Date(b.createdAt || b.updatedAt || 0) -
              new Date(a.createdAt || a.updatedAt || 0)
          )
        );
      } catch (error) {
        console.error("Orders error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const currentOrders =
    activeTab === "paid" ? paidOrders : pendingOrders;

  /*
    ---------------------------------------------------------
    ORDER PAGINATION
    Latest 10 orders -> page 1
    Next 10 orders  -> page 2
    ---------------------------------------------------------
  */

  const totalOrderPages = Math.max(
    1,
    Math.ceil(currentOrders.length / ORDERS_PER_PAGE)
  );

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ORDERS_PER_PAGE;

    return currentOrders.slice(
      start,
      start + ORDERS_PER_PAGE
    );
  }, [currentOrders, orderPage]);

  /*
    Tab change hone par page 1
  */
  useEffect(() => {
    setOrderPage(1);
  }, [activeTab]);

  /*
    Agar current page exist nahi karta
  */
  useEffect(() => {
    if (orderPage > totalOrderPages) {
      setOrderPage(totalOrderPages);
    }
  }, [orderPage, totalOrderPages]);

  /*
    ---------------------------------------------------------
    OPEN ORDER DETAILS
    ---------------------------------------------------------
  */

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setProductPage(1);

    document.body.style.overflow = "hidden";
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setProductPage(1);

    document.body.style.overflow = "";
  };

  /*
    ---------------------------------------------------------
    PRODUCT PAGINATION INSIDE POPUP
    ---------------------------------------------------------
  */

  const selectedProducts = selectedOrder?.products || [];
  console.log("========== SELECTED ORDER IN ADMIN POPUP ==========");
  console.log("Selected Order:", selectedOrder);
  console.log("Products:", selectedOrder?.products);

  const totalProductPages = Math.max(
    1,
    Math.ceil(selectedProducts.length / PRODUCTS_PER_PAGE)
  );

  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * PRODUCTS_PER_PAGE;

    return selectedProducts.slice(
      start,
      start + PRODUCTS_PER_PAGE
    );
  }, [selectedProducts, productPage]);

  /*
    ---------------------------------------------------------
    HELPERS
    ---------------------------------------------------------
  */

  const getCustomerName = (order) => {
    const name =
      `${order?.customerFirstName || ""} ${order?.customerLastName || ""
        }`.trim();

    return name || "N/A";
  };

  const getContact = (order) => {
    return (
      order?.customerEmail ||
      order?.customerPhone ||
      "N/A"
    );
  };

  const getOrderId = (order) => {
    return (
      order?.orderId ||
      order?.razorpayOrderId ||
      order?._id ||
      "N/A"
    );
  };

  /*
    IMPORTANT:
    Main amount me Razorpay paise conversion/multiplication
    nahi kar rahe.
    
    Backend ka totalAmount jo normal INR amount hai
    wahi display hoga.
  */
  const getOrderAmount = (order) => {
    const amount =
      order?.totalAmount ??
      order?.amount ??
      0;

    return Number(amount) || 0;
  };

  /*
    Address
  */
  const getAddress = (order) => {
    const address = order?.shippingAddress || {};

    if (address.fullAddress) {
      return address.fullAddress;
    }

    return [
      address.houseNo,
      address.street,
      address.landMark,
      address.city,
      address.district,
      address.state,
      address.country,
      address.pincode,
      address.zipCode,
    ]
      .filter(Boolean)
      .join(", ") || "N/A";
  };

  /*
    DATE
  */
  const formatDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "N/A";
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /*
    ---------------------------------------------------------
    IMPORTANT PRODUCT PRICE
    ---------------------------------------------------------

    Product_price = cart me jo actual selling price gaya tha.

    MRP use nahi kar rahe.
    Razorpay amount use nahi kar rahe.
    Product_price ko quantity se multiply karke bhi
    individual price nahi dikha rahe.

    Example:
    Product_price = 91.66
    quantity = 276

    Popup:
    PRICE = ₹91.66
    ORDERED QTY = 276 pcs
  */

  const getProductPrice = (item) => {
    const price = item?.Product_price;

    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return 0;
    }

    return Number(price) || 0;
  };

  /*
    CUSTOMER ORDERED QUANTITY

    Sabse important:
    item.quantity = cart/order quantity

    Product_Quantity_18 etc. stock values hain,
    unko ordered quantity nahi maana ja raha.
  */

  const getOrderedQuantity = (item) => {
    const qty = item?.quantity;

    if (
      qty !== undefined &&
      qty !== null &&
      qty !== ""
    ) {
      return Number(qty) || 0;
    }

    /*
      Agar old order me quantity field nahi hai,
      fallback ke liye Product_Quantity use karenge.
    */
    if (
      item?.Product_Quantity !== undefined &&
      item?.Product_Quantity !== null
    ) {
      return Number(item.Product_Quantity) || 0;
    }

    return 0;
  };

  const getProductName = (item) => {
    return (
      item?.Product_Name ||
      item?.productName ||
      item?.name ||
      "Product"
    );
  };

  const getModel = (item) => {
    return (
      item?.Model_number ||
      item?.model_number ||
      item?.model ||
      "N/A"
    );
  };

  const getProductImage = (item) => {
    return (
      item?.image_01 ||
      item?.image ||
      item?.productImage ||
      ""
    );
  };

  const totalOrderedQuantity = selectedProducts.reduce(
    (total, item) => total + getOrderedQuantity(item),
    0
  );

  return (
    <div className="onord-page">

      {/* ================= HEADER ================= */}

      <div className="onord-header">
        <div>
          <h1>Orders</h1>
          <p>
            Manage all customer paid and pending orders here.
          </p>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="onord-stats">

        <div className="onord-card">
          <div className="onord-card-icon paid-icon">
            ✓
          </div>

          <div>
            <h4>PAID ORDERS</h4>
            <h2>
              {loading ? "..." : paidOrders.length}
            </h2>
          </div>
        </div>

        <div className="onord-card">
          <div className="onord-card-icon pending-icon">
            ◷
          </div>

          <div>
            <h4>PENDING ORDERS</h4>
            <h2>
              {loading ? "..." : pendingOrders.length}
            </h2>
          </div>
        </div>

        <div className="onord-card">
          <div className="onord-card-icon total-icon">
            □
          </div>

          <div>
            <h4>TOTAL ORDERS</h4>
            <h2>
              {loading
                ? "..."
                : paidOrders.length + pendingOrders.length}
            </h2>
          </div>
        </div>

      </div>

      {/* ================= TABS ================= */}

      <div className="onord-tabs">

        <button
          className={
            activeTab === "paid"
              ? "active"
              : ""
          }
          onClick={() => setActiveTab("paid")}
        >
          Paid Orders

          <span>
            {paidOrders.length}
          </span>
        </button>

        <button
          className={
            activeTab === "pending"
              ? "active"
              : ""
          }
          onClick={() => setActiveTab("pending")}
        >
          Pending Orders

          <span>
            {pendingOrders.length}
          </span>
        </button>

      </div>

      {/* ================= TABLE ================= */}

      <div className="onord-table-box">

        {loading ? (
          <div className="onord-empty">
            Loading orders...
          </div>
        ) : paginatedOrders.length > 0 ? (

          <div className="onord-table-wrap">

            <table className="onord-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Qty 18</th>
                  <th>Qty 104</th>
                  <th>WH Stock</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {paginatedOrders.map(
                  (order, index) => {

                    const customerName =
                      getCustomerName(order);

                    const orderId =
                      getOrderId(order);

                    const amount =
                      getOrderAmount(order);

                    /*
                      Table qty summary
                      Ye stock quantities hain, isliye
                      main ordered quantity ke liye popup
                      me item.quantity dikha rahe hain.
                    */

                    const qty18 =
                      (order.products || []).reduce(
                        (sum, item) =>
                          sum +
                          (Number(
                            item?.Product_Quantity_18
                          ) || 0),
                        0
                      );

                    const qty104 =
                      (order.products || []).reduce(
                        (sum, item) =>
                          sum +
                          (Number(
                            item?.Product_Quantity_104
                          ) || 0),
                        0
                      );

                    const warehouseQty =
                      (order.products || []).reduce(
                        (sum, item) =>
                          sum +
                          (Number(
                            item?.Product_Quantity_Warehouse
                          ) || 0),
                        0
                      );

                    /*
                      Overall table index
                    */
                    const serialNumber =
                      (orderPage - 1) *
                      ORDERS_PER_PAGE +
                      index +
                      1;

                    return (
                      <tr
                        key={
                          order?._id ||
                          order?.orderId ||
                          index
                        }
                      >

                        <td>
                          {serialNumber}
                        </td>

                        <td>
                          <div className="onord-customer">
                            <div className="onord-avatar">
                              {customerName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>
                              {customerName}
                            </strong>
                          </div>
                        </td>

                        <td>
                          <span className="onord-order-id">
                            {orderId}
                          </span>
                        </td>

                        <td>
                          <strong className="onord-amount">
                            ₹
                            {amount.toLocaleString(
                              "en-IN",
                              {
                                maximumFractionDigits: 2,
                              }
                            )}
                          </strong>
                        </td>

                        <td>
                          {qty18}
                        </td>

                        <td>
                          {qty104}
                        </td>

                        <td>
                          <span className="warehouse-stock">
                            {warehouseQty}
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            order?.createdAt ||
                            order?.updatedAt
                          )}
                        </td>

                        <td>

                          <button
                            className="view-items-btn"
                            onClick={() =>
                              openOrderDetails(order)
                            }
                          >
                            <span>View Items</span>
                            <span className="view-items-arrow">
                              →
                            </span>
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="onord-empty">
            No orders found
          </div>

        )}

      </div>

      {/* ================= ORDER PAGINATION ================= */}

      {!loading &&
        currentOrders.length > ORDERS_PER_PAGE && (

          <div className="onord-pagination">

            <button
              disabled={orderPage === 1}
              onClick={() =>
                setOrderPage((p) =>
                  Math.max(1, p - 1)
                )
              }
            >
              ← Prev
            </button>

            <div className="onord-page-numbers">

              {Array.from(
                {
                  length: totalOrderPages,
                },
                (_, i) => i + 1
              ).map((page) => (

                <button
                  key={page}
                  className={
                    orderPage === page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setOrderPage(page)
                  }
                >
                  {page}
                </button>

              ))}

            </div>

            <button
              disabled={
                orderPage === totalOrderPages
              }
              onClick={() =>
                setOrderPage((p) =>
                  Math.min(
                    totalOrderPages,
                    p + 1
                  )
                )
              }
            >
              Next →
            </button>

          </div>
        )}

      {/* =====================================================
          ORDER DETAILS MODAL
          ===================================================== */}

      {selectedOrder && (

        <div
          className="onord-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target.className ===
              "onord-modal-overlay"
            ) {
              closeOrderDetails();
            }
          }}
        >

          <div className="onord-modal">

            {/* ================= MODAL HEADER ================= */}

            <div className="onord-modal-header">

              <div>
                <h2>Ordered Items</h2>

                <p>
                  Order ID:{" "}
                  <strong>
                    {getOrderId(
                      selectedOrder
                    )}
                  </strong>
                </p>
              </div>

              <button
                className="onord-modal-close"
                onClick={closeOrderDetails}
              >
                ×
              </button>

            </div>

            {/* ================= CUSTOMER INFO ================= */}

            <div className="onord-order-info">

              <div className="order-info-box">
                <span>Customer</span>
                <strong>
                  {getCustomerName(
                    selectedOrder
                  )}
                </strong>
              </div>

              <div className="order-info-box">
                <span>Email</span>
                <strong>
                  {selectedOrder?.customerEmail ||
                    "N/A"}
                </strong>
              </div>

              <div className="order-info-box">
                <span>Phone</span>
                <strong>
                  {selectedOrder?.customerPhone ||
                    "N/A"}
                </strong>
              </div>

              <div className="order-info-box">
                <span>Status</span>

                <strong
                  className={`status-badge ${String(
                    selectedOrder?.status ||
                    "Pending"
                  )
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {selectedOrder?.status ||
                    "Pending"}
                </strong>
              </div>

              <div className="order-info-box">
                <span>Order Date</span>
                <strong>
                  {formatDate(
                    selectedOrder?.createdAt
                  )}
                </strong>
              </div>

              <div className="order-info-box address-box">
                <span>Delivery Address</span>

                <strong>
                  {getAddress(
                    selectedOrder
                  )}
                </strong>
              </div>

            </div>

            {/* ================= PRODUCTS ================= */}

            <div className="onord-products-container">

              <div className="onord-products-heading">

                <div>
                  <h3>Products</h3>

                  <span>
                    {selectedProducts.length}{" "}
                    Product
                    {selectedProducts.length !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>

                {selectedProducts.length >
                  PRODUCTS_PER_PAGE && (

                    <div className="popup-page-info">
                      Page {productPage} of{" "}
                      {totalProductPages}
                    </div>

                  )}

              </div>

              {paginatedProducts.length > 0 ? (

                <div className="onord-product-list">

                  {paginatedProducts.map(
                    (item, index) => {

                      const image =
                        getProductImage(
                          item
                        );

                      const productName =
                        getProductName(
                          item
                        );

                      const model =
                        getModel(item);

                      const price =
                        getProductPrice(
                          item
                        );

                      const orderedQty =
                        getOrderedQuantity(
                          item
                        );

                      return (

                        <div
                          className="onord-product-card"
                          key={
                            item?._id ||
                            item?.product_id ||
                            index
                          }
                        >

                          {/* IMAGE */}

                          <div className="onord-product-image-wrap">

                            {image ? (

                              <img
                                src={image}
                                alt={productName}
                                className="onord-product-image"
                              />

                            ) : (

                              <div className="no-product-image">
                                No Image
                              </div>

                            )}

                          </div>

                          {/* DETAILS */}

                          <div className="onord-product-details">

                            <h3>
                              {productName}
                            </h3>

                            <div className="product-detail-grid">

                              <div className="product-detail-item model-item">

                                <span>
                                  MODEL
                                </span>

                                <strong>
                                  {model}
                                </strong>

                              </div>

                              <div className="product-detail-item price-item">

                                <span>
                                  PRICE
                                </span>

                                <strong>
                                  ₹
                                  {price.toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </strong>

                              </div>

                              <div className="product-detail-item qty-item">

                                <span>
                                  CUSTOMER ORDERED QTY
                                </span>

                                <strong>
                                  {orderedQty} pcs
                                </strong>

                              </div>

                            </div>

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

              ) : (

                <div className="popup-no-products">
                  No product details available.
                </div>

              )}

            </div>

            {/* ================= PRODUCT PAGINATION ================= */}

            {selectedProducts.length >
              PRODUCTS_PER_PAGE && (

                <div className="popup-pagination">

                  <button
                    disabled={productPage === 1}
                    onClick={() =>
                      setProductPage((p) =>
                        Math.max(1, p - 1)
                      )
                    }
                  >
                    ← Prev
                  </button>

                  <div className="popup-page-numbers">

                    {Array.from(
                      {
                        length:
                          totalProductPages,
                      },
                      (_, i) => i + 1
                    ).map((page) => (

                      <button
                        key={page}
                        className={
                          productPage === page
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setProductPage(page)
                        }
                      >
                        {page}
                      </button>

                    ))}

                  </div>

                  <button
                    disabled={
                      productPage ===
                      totalProductPages
                    }
                    onClick={() =>
                      setProductPage((p) =>
                        Math.min(
                          totalProductPages,
                          p + 1
                        )
                      )
                    }
                  >
                    Next →
                  </button>

                </div>

              )}

            {/* ================= MODAL FOOTER ================= */}

            <div className="onord-modal-footer">

              <div>
                <span>Total Products</span>
                <strong>
                  {selectedProducts.length}
                </strong>
              </div>

              <div>
                <span>Total Ordered Quantity</span>
                <strong>
                  {totalOrderedQuantity} pcs
                </strong>
              </div>

              <div>
                <span>Order Amount</span>
                <strong>
                  ₹
                  {getOrderAmount(
                    selectedOrder
                  ).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}