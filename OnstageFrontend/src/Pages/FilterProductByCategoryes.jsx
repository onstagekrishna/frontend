import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../Redux/Slices/WishlistSlice";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

export default function FilterProductByCategoryes() {

  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [allBrands, setAllBrands] = useState({});
  const [allCategories, setAllCategories] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortType, setSortType] = useState("");
  const [openCategory, setOpenCategory] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const typeParam = queryParams.get("type");
  const activeSub = queryParams.get("subCategory");

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.Wishlist?.items || []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const params = new URLSearchParams(location.search);

        if (!params.get("page")) {
          params.set("page", 1);
          navigate(`${location.pathname}?${params.toString()}`, {
            replace: true,
          });
          return;
        }
        const page = Number(params.get("page")) || 1;
        params.set("page", page);

        const res = await fetch(
          `https://api.onstage.co.in/api/v1/categoryProduct?${params.toString()}`
        );

        const data = await res.json();

        setProducts(data.products || []);

        setAllBrands(data.brandCount || {});

        setAllCategories(data.categoryWithSubCategories || {});

        setTotalPages(Number(data.totalPages) || 1);
        setCurrentPage(page);

      } catch (err) {
        console.log(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [location.search, location.pathname]);



  function applyFilter(type, value) {
    const params = new URLSearchParams(location.search);
    params.set("page", 1);

    if (type === "brand") {
      params.set("brand", value);
      params.delete("subCategory");
    }

    if (type === "subCategory") {
      params.set("subCategory", value);
      params.delete("brand");
    }

    navigate(`${location.pathname}?${params.toString()}`);
    setIsOpen(false);
  }

  function handleSort(e) {
    const value = e.target.value;
    setSortType(value);

    const params = new URLSearchParams(location.search);

    if (value === "") {
      params.delete("sort");
    } else {
      params.set("sort", value === "low" ? "asc" : "desc");
    }

    params.set("page", 1);
    navigate(`${location.pathname}?${params.toString()}`);
  }

  function changePage(page) {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(location.search);
    params.set("page", page);

    navigate(`${location.pathname}?${params.toString()}`);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const getPagination = (currentPage, totalPages) => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const handleProductClick = (product) => {
    console.log("FULL PRODUCT:", product);
    navigate(`/productDetails/${product.product_id}`, { state: product });
  };

  return (
    <section className="ecom-products-section">
      <div className="container">
        <div className="ecom-breadcrumb">
          <span onClick={() => navigate("/")}>Home</span> /{" "}
          <span
            className="active-breadcrumb"
            onClick={() => {
              const params = new URLSearchParams();
              params.set("type", typeParam || "");
              params.set("page", 1);
              navigate(`/category?${params.toString()}`);
            }}
          >
            {typeParam}
          </span>
        </div>

        <h2 className="ecom-products-heading">{typeParam}</h2>

        <div className="ecom-filter-row">
          <button className="fpc-filter-btn" onClick={() => setIsOpen(true)}>
            <FiFilter size={18} /> Filter
          </button>

          <select className="fpc-sort" value={sortType} onChange={handleSort}>
            <option value="">Sort By</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

        <div
          className={`fpc-overlay ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`fpc-sidebar ${isOpen ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fpc-sidebar-header">
              <h3>Filter</h3>
              <IoClose size={22} onClick={() => setIsOpen(false)} />
            </div>

            <h3 className="product-cat-heading">PRODUCT CATEGORIES</h3>

            {Object.entries(allCategories).map(([category, subs]) => {
              const isActive = typeParam === category;

              return (
                <div key={category} className="category-block">
                  <div
                    className={`category-title ${isActive ? "active-cat" : ""}`}
                    onClick={() =>
                      setOpenCategory(openCategory === category ? null : category)
                    }
                  >
                    <span>{category}</span>

                    {openCategory === category ? (
                      <IoChevronDown className="category-arrow" />
                    ) : (
                      <IoChevronForward className="category-arrow" />
                    )}
                  </div>
                  {openCategory === category && (
                    <div className="subcategory-list">
                      {subs.map((sub, i) => (
                        <p
                          key={sub}
                          className={`subcategory-item ${activeSub === sub ? "active-sub" : ""
                            }`}
                          onClick={() => applyFilter("subCategory", sub)}
                        >
                          {sub}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <h3 className="product-cat-heading">BRAND NAME</h3>

            {Object.entries(allBrands).map(([brand, count], i) => (
              <p
                key={brand}
                className="subcategory-item"
                onClick={() => applyFilter("brand", brand)}
              >
                {brand} ({count})
              </p>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : products.length === 0 ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              padding: "80px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
              alt="No Product Found"
              style={{ width: "120px", marginBottom: "20px", opacity: 0.8 }}
            />

            <h2 style={{ fontSize: "24px", marginBottom: "10px", color: "#222" }}>
              Product Not Found
            </h2>

            <p style={{ color: "#777", fontSize: "15px" }}>
              No products available for the selected filter.
            </p>
          </div>
        ) : (
          <div className="ecom-products-grid">
            {products.map((item) => {
              const brand = item?.Brand_Name || "";
              const type = item?.Product_Subcategory || "";
              const name = item?.Product_Name || "";
              const mrp = Math.round(Number(item?.MRP || 0));
              const cutPrice = Math.round(Number(item?.Product_price || 0));
              const image = item?.image_01 || "";
              const model = item?.Model_number || "";

              const isWishlisted = wishlistItems.some(
                (w) => w.product_id === item.product_id
              );

              return (
                <div
                  className="ecom-product-card"
                  key={item.product_id}
                  onClick={() => handleProductClick(item)}
                >
                  <div className="ecom-product-img">
                    <img src={image} alt={name} />

                    <div
                      className={`wishlist-box ${isWishlisted ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();

                        if (isWishlisted) {
                          dispatch(removeFromWishlist(item.product_id));

                          window.showNotification(
                            "Removed from Wishlist",
                            "info"
                          );
                        } else {
                          dispatch(addToWishlist(item));

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
                  </div>

                  <div className="ecom-product-info">
                    <h5 className="ecom-brand">{brand}</h5>
                    <p className="ecom-model">Model: {model}</p>
                    <p className="ecom-type">{type}</p>
                    <h4 className="ecom-title">{name}</h4>

                    <div className="ecom-price-box">
                      <span className="ecom-price">
                        MRP ₹{mrp.toLocaleString("en-IN")}
                      </span>

                      {Number(item.totalReviews) > 0 && Number(item.averageRating) > 0 && (
                        <span className="ecom-rating">
                          <FaStar className="rating-star" />
                          {Number(item.averageRating).toFixed(1)} ({item.totalReviews})
                        </span>
                      )}

                      {cutPrice > mrp && (
                        <span className="ecom-old-price">
                          ₹{cutPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              &lt; Prev
            </button>

            <span className="page-number">
              {currentPage}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
            >
              Next &gt;
            </button>
          </div>

        )}
      </div>
    </section>
  );
}

