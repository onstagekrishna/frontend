import React, { useEffect, useRef, useState } from "react";


const PRODUCT_API = "https://api.musicandmore.co.in/api/v1/categoryProduct";

export default function Dashboard() {
  const graphRef = useRef(null);

  const [data, setData] = useState({
    products: 0,
    brands: 0,
    users: 0,
    brandData: [],
  });

  const [loading, setLoading] = useState(true);

  const colors = [
    "#4f46e5",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#f97316",
  ];

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("limit", "10000");

        const res = await fetch(`${PRODUCT_API}?${params.toString()}`);
        const result = await res.json();

        const productsArray =
          result.products ||
          result.product ||
          result.data ||
          result.result ||
          result.productsData ||
          [];

        const totalProducts =
          result.totalProducts ||
          result.total ||
          result.totalCount ||
          productsArray.length ||
          0;

        const brandCount = {};

        productsArray.forEach((product) => {
          const brandName =
            product.Brand_Name ||
            product.brandName ||
            product.brand_name ||
            product.brand?.Brand_Name ||
            product.brand?.brandName ||
            product.brand?.name ||
            "Unknown";

          brandCount[brandName] = (brandCount[brandName] || 0) + 1;
        });

        const brandData = Object.entries(brandCount).map(([name, count]) => ({
          name,
          productCount: count,
        }));

        setData({
          products: totalProducts,
          brands: brandData.length,
          users: 0,
          brandData,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleMouseDown = (e) => {
    const slider = graphRef.current;
    if (!slider) return;

    slider.classList.add("mmad-dragging");

    const startX = e.pageX - slider.offsetLeft;
    const scrollLeft = slider.scrollLeft;

    const handleMouseMove = (ev) => {
      const x = ev.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      slider.classList.remove("mmad-dragging");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const stats = [
    { label: "TOTAL PRODUCTS", value: data.products },
    { label: "TOTAL USERS", value: data.users },
    { label: "TOTAL BRANDS", value: data.brands },
  ];

  const brandEntries = [...data.brandData].sort(
    (a, b) => b.productCount - a.productCount
  );

  const maxVal = Math.max(...brandEntries.map((b) => b.productCount), 1);

  return (
    <div className="mmad-dashboard">
      <h1>Dashboard Overview</h1>

      <p className="mmad-subtitle">
        Essential metrics and brand-wise distribution
      </p>

      <div className="mmad-stats-grid">
        {stats.map((item, index) => (
          <div className="mmad-stat-card" key={index}>
            <h4>{item.label}</h4>
            <h2>{loading ? "..." : item.value}</h2>
          </div>
        ))}
      </div>

      <div className="mmad-graph-card">
        <div className="mmad-graph-header">
          <h2>Brand-wise Products</h2>
          <span>Total Products: {loading ? "..." : data.products}</span>
        </div>

        <div
          ref={graphRef}
          className="mmad-bar-slider"
          onMouseDown={handleMouseDown}
        >
          {loading ? (
            <div className="mmad-placeholder">Loading graph...</div>
          ) : brandEntries.length > 0 ? (
            brandEntries.map((item, index) => (
              <div className="mmad-bar-item" key={index}>
                <div className="mmad-bar-bg">
                  <div
                    className="mmad-bar-fill"
                    style={{
                      height: `${(item.productCount / maxVal) * 100}%`,
                      backgroundColor: colors[index % colors.length],
                    }}
                  >
                    <span>{item.productCount}</span>
                  </div>
                </div>

                <p title={item.name}>{item.name}</p>
              </div>
            ))
          ) : (
            <div className="mmad-placeholder">No brand data found</div>
          )}
        </div>
      </div>
    </div>
  );
}