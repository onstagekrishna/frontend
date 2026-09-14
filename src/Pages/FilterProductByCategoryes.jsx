import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";

import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../Redux/Slices/WishlistSlice";



export default function FilterProductByCategoryes() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  /* =========================================================
     REDUX
  ========================================================= */

  const wishlistItems = useSelector(
    (state) => state.Wishlist?.items || []
  );

  /* =========================================================
     STATES
  ========================================================= */

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  const [allBrands, setAllBrands] = useState({});

  const [allCategories, setAllCategories] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [sortType, setSortType] = useState("");

  const [openCategory, setOpenCategory] = useState(null);

  /* =========================================================
     URL PARAMETERS

     IMPORTANT:
     location.search changes whenever Header category is clicked.
     This makes the page react WITHOUT browser refresh.
  ========================================================= */

  const queryParams = new URLSearchParams(location.search);

  const typeParam = queryParams.get("type") || "";

  const brandParam = queryParams.get("brand") || "";

  const activeSub = queryParams.get("subCategory") || "";

  const pageParam = Number(queryParams.get("page")) || 1;

  const sortParam = queryParams.get("sort") || "";

  /* =========================================================
     BODY SCROLL LOCK FOR MOBILE FILTER
  ========================================================= */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* =========================================================
     SYNC SORT WITH URL
  ========================================================= */

  useEffect(() => {
    if (sortParam === "asc") {
      setSortType("low");
    } else if (sortParam === "desc") {
      setSortType("high");
    } else {
      setSortType("");
    }
  }, [sortParam]);

  /* =========================================================
     IMPORTANT:
     WHEN CATEGORY / BRAND / SUBCATEGORY CHANGES

     Reset mobile filter UI and opened category.

     This runs without page refresh.
  ========================================================= */

  useEffect(() => {
    setIsOpen(false);
    setOpenCategory(null);
  }, [typeParam, brandParam, activeSub]);

  /* =========================================================
     FETCH PRODUCTS

     location.search is the MAIN dependency.

     Header:
     /category?type=Guitars&page=1

     Then:

     /category?type=Drums%20%26%20Drum%20Accessories&page=1

     React detects location.search change and fetches again.
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams(location.search);

        /* =====================================================
           ALWAYS KEEP PAGE
        ===================================================== */

        let page = Number(params.get("page")) || 1;

        if (page < 1) {
          page = 1;
        }

        params.set("page", page);

        /* =====================================================
           API CALL
        ===================================================== */

        const url =
          `https://api.onstage.co.in/api/v1/categoryProduct?` +
          params.toString();

        console.log(
          "CATEGORY API REQUEST:",
          url
        );

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(
            `API Error: ${res.status}`
          );
        }

        const data = await res.json();

        console.log(
          "CATEGORY API RESPONSE:",
          data
        );

        /* =====================================================
           IGNORE OLD API RESPONSE

           Agar user quickly:

           Guitars -> Drums -> Amplifiers

           click kare, purani API response latest products
           ko overwrite nahi karegi.
        ===================================================== */

        if (cancelled) {
          return;
        }

        /* =====================================================
           PRODUCTS
        ===================================================== */

        const fetchedProducts =
          Array.isArray(data?.products)
            ? data.products
            : [];

        setProducts(fetchedProducts);

        /* =====================================================
           BRANDS

           API se latest available filter data rakho.
           Pehle wala data permanently lock nahi hoga.
        ===================================================== */

        if (
          data?.brandCount &&
          typeof data.brandCount === "object"
        ) {
          setAllBrands(data.brandCount);
        }

        /* =====================================================
           CATEGORIES
        ===================================================== */

        if (
          data?.categoryWithSubCategories &&
          typeof data.categoryWithSubCategories ===
            "object"
        ) {
          setAllCategories(
            data.categoryWithSubCategories
          );
        }

        /* =====================================================
           PAGINATION
        ===================================================== */

        setTotalPages(
          Math.max(
            1,
            Number(data?.totalPages) || 1
          )
        );

        setCurrentPage(page);

      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Category Products Error:",
          error
        );

        setProducts([]);

        setTotalPages(1);

        setCurrentPage(1);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };

  }, [
    location.search,
    location.pathname,
  ]);

  /* =========================================================
     APPLY FILTER
  ========================================================= */

  const applyFilter = (filterType, value) => {
    const params = new URLSearchParams(
      location.search
    );

    /* =====================================================
       PAGE ALWAYS 1 AFTER FILTER
    ===================================================== */

    params.set("page", "1");

    /* =====================================================
       BRAND FILTER
    ===================================================== */

    if (filterType === "brand") {
      params.set("brand", value);

      params.delete("subCategory");

      console.log(
        "Brand Filter:",
        value
      );
    }

    /* =====================================================
       SUBCATEGORY FILTER
    ===================================================== */

    if (filterType === "subCategory") {
      params.set(
        "subCategory",
        value
      );

      params.delete("brand");

      console.log(
        "Subcategory Filter:",
        value
      );
    }

    /* =====================================================
       NAVIGATE

       This changes location.search.

       Fetch useEffect automatically runs.
    ===================================================== */

    navigate(
      `${location.pathname}?${params.toString()}`
    );

    /* =====================================================
       CLOSE MOBILE FILTER
    ===================================================== */

    setIsOpen(false);
  };

  /* =========================================================
     SORT
  ========================================================= */

  const handleSort = (e) => {
    const value = e.target.value;

    setSortType(value);

    const params = new URLSearchParams(
      location.search
    );

    /* =====================================================
       REMOVE SORT
    ===================================================== */

    if (value === "") {
      params.delete("sort");
    }

    /* =====================================================
       LOW -> HIGH
    ===================================================== */

    else if (value === "low") {
      params.set("sort", "asc");
    }

    /* =====================================================
       HIGH -> LOW
    ===================================================== */

    else if (value === "high") {
      params.set("sort", "desc");
    }

    /* =====================================================
       SORT ALWAYS STARTS PAGE 1
    ===================================================== */

    params.set("page", "1");

    navigate(
      `${location.pathname}?${params.toString()}`
    );
  };

  /* =========================================================
     PAGINATION
  ========================================================= */

  const changePage = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    const params = new URLSearchParams(
      location.search
    );

    params.set(
      "page",
      String(page)
    );

    navigate(
      `${location.pathname}?${params.toString()}`
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     PAGINATION HELPER
  ========================================================= */

  const getPagination = (
    current,
    total
  ) => {
    const delta = 2;

    const range = [];

    const rangeWithDots = [];

    let previous;

    for (
      let i = 1;
      i <= total;
      i++
    ) {
      if (
        i === 1 ||
        i === total ||
        (
          i >= current - delta &&
          i <= current + delta
        )
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (previous) {
        if (i - previous === 2) {
          rangeWithDots.push(
            previous + 1
          );
        } else if (
          i - previous > 2
        ) {
          rangeWithDots.push(
            "..."
          );
        }
      }

      rangeWithDots.push(i);

      previous = i;
    }

    return rangeWithDots;
  };

  /* =========================================================
     PRODUCT CLICK
  ========================================================= */

  const handleProductClick = (
    product
  ) => {
    if (!product) return;

    const identifier =
      slugify(
        product.Product_Name
      ) ||
      product.product_id;

    if (!identifier) return;

    navigate(
      `/productDetails/${identifier}`,
      {
        state: product,
      }
    );
  };

  /* =========================================================
     WISHLIST CHECK
  ========================================================= */

  const isProductWishlisted = (
    productId
  ) => {
    return wishlistItems.some(
      (item) =>
        String(
          item?.product_id ||
          item?._id ||
          item?.id
        ) ===
        String(productId)
    );
  };

  /* =========================================================
     WISHLIST
  ========================================================= */

  const handleWishlist = (
    e,
    item
  ) => {
    e.stopPropagation();

    const productId =
      item?.product_id ||
      item?._id ||
      item?.id;

    if (!productId) {
      return;
    }

    const isWishlisted =
      isProductWishlisted(
        productId
      );

    if (isWishlisted) {
      dispatch(
        removeFromWishlist(
          productId
        )
      );

      if (
        typeof window.showNotification ===
        "function"
      ) {
        window.showNotification(
          "Removed from Wishlist",
          "info"
        );
      }

    } else {
      dispatch(
        addToWishlist({
          ...item,
          product_id: productId,
        })
      );

      if (
        typeof window.showNotification ===
        "function"
      ) {
        window.showNotification(
          "Added to Wishlist",
          "success"
        );
      }
    }
  };

  /* =========================================================
     PAGINATION BUTTONS
  ========================================================= */

  const paginationItems =
    getPagination(
      currentPage,
      totalPages
    );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="ecom-products-section">

      <div className="container">

        {/* ===================================================
            BREADCRUMB
        =================================================== */}

        <div className="ecom-breadcrumb">

          <span
            onClick={() =>
              navigate("/")
            }
          >
            Home
          </span>

          {" / "}

          <span className="active-breadcrumb">
            {typeParam ||
              brandParam ||
              activeSub ||
              "Products"}
          </span>

        </div>

        {/* ===================================================
            HEADING
        =================================================== */}

        <h2 className="ecom-products-heading">
          {typeParam ||
            brandParam ||
            activeSub ||
            "Products"}
        </h2>

        {/* ===================================================
            FILTER + SORT
        =================================================== */}

        <div className="ecom-filter-row">

          <button
            type="button"
            className="fpc-filter-btn"
            onClick={() =>
              setIsOpen(true)
            }
          >
            <FiFilter size={18} />

            <span>
              Filter
            </span>
          </button>

          <select
            className="fpc-sort"
            value={sortType}
            onChange={handleSort}
          >
            <option value="">
              Sort By
            </option>

            <option value="low">
              Price: Low → High
            </option>

            <option value="high">
              Price: High → Low
            </option>
          </select>

        </div>

        {/* ===================================================
            MOBILE FILTER OVERLAY
        =================================================== */}

        <div
          className={`fpc-overlay ${
            isOpen
              ? "active"
              : ""
          }`}
          onClick={() =>
            setIsOpen(false)
          }
        >

          <div
            className={`fpc-sidebar ${
              isOpen
                ? "open"
                : ""
            }`}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ===============================================
                FILTER HEADER
            =============================================== */}

            <div className="fpc-sidebar-header">

              <h3>
                Filter
              </h3>

              <button
                type="button"
                className="fpc-close-btn"
                onClick={() =>
                  setIsOpen(false)
                }
              >
                <IoClose
                  size={22}
                />
              </button>

            </div>

            {/* ===============================================
                PRODUCT CATEGORIES
            =============================================== */}

            <h3 className="product-cat-heading">
              PRODUCT CATEGORIES
            </h3>

            <div className="fpc-category-list">

              {Object.entries(
                allCategories
              ).map(
                ([
                  category,
                  subs,
                ]) => {

                  const isActive =
                    typeParam ===
                    category;

                  const isCategoryOpen =
                    openCategory ===
                    category;

                  const subcategories =
                    Array.isArray(
                      subs
                    )
                      ? subs
                      : [];

                  return (
                    <div
                      key={category}
                      className="category-block"
                    >

                      {/* CATEGORY TITLE */}

                      <div
                        className={`category-title ${
                          isActive
                            ? "active-cat"
                            : ""
                        }`}
                        onClick={() =>
                          setOpenCategory(
                            isCategoryOpen
                              ? null
                              : category
                          )
                        }
                      >

                        <span>
                          {category}
                        </span>

                        {isCategoryOpen ? (
                          <IoChevronDown className="category-arrow" />
                        ) : (
                          <IoChevronForward className="category-arrow" />
                        )}

                      </div>

                      {/* SUBCATEGORIES */}

                      {isCategoryOpen && (
                        <div className="subcategory-list">

                          {subcategories.map(
                            (
                              sub,
                              index
                            ) => (

                              <p
                                key={`${sub}-${index}`}
                                className={`subcategory-item ${
                                  activeSub ===
                                  sub
                                    ? "active-sub"
                                    : ""
                                }`}
                                onClick={() =>
                                  applyFilter(
                                    "subCategory",
                                    sub
                                  )
                                }
                              >
                                {sub}
                              </p>

                            )
                          )}

                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>

            {/* ===============================================
                BRAND
            =============================================== */}

            <h3 className="product-cat-heading">
              BRAND NAME
            </h3>

            <div className="fpc-brand-list">

              {Object.entries(
                allBrands
              ).map(
                (
                  [
                    brand,
                    count,
                  ]
                ) => (

                  <p
                    key={brand}
                    className={`subcategory-item ${
                      brandParam ===
                      brand
                        ? "active-sub"
                        : ""
                    }`}
                    onClick={() =>
                      applyFilter(
                        "brand",
                        brand
                      )
                    }
                  >

                    {brand}

                    {count !==
                      undefined &&
                      ` (${count})`}

                  </p>

                )
              )}

            </div>

          </div>

        </div>

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        {loading ? (

          <div
            className="fpc-loading"
            style={{
              textAlign:
                "center",
              padding:
                "60px 20px",
            }}
          >
            Loading...
          </div>

        ) : products.length ===
          0 ? (

          <div
            className="fpc-no-products"
            style={{
              width: "100%",
              textAlign:
                "center",
              padding:
                "80px 20px",
              display: "flex",
              flexDirection:
                "column",
              alignItems:
                "center",
              justifyContent:
                "center",
            }}
          >

            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
              alt="No Product Found"
              style={{
                width: "120px",
                marginBottom:
                  "20px",
                opacity: 0.8,
              }}
            />

            <h2
              style={{
                fontSize:
                  "24px",
                marginBottom:
                  "10px",
                color:
                  "#222",
              }}
            >
              Product Not Found
            </h2>

            <p
              style={{
                color:
                  "#777",
                fontSize:
                  "15px",
              }}
            >
              No products available
              for the selected
              filter.
            </p>

          </div>

        ) : (

          <div className="ecom-products-grid">

            {products.map(
              (
                item,
                index
              ) => {

                if (!item) {
                  return null;
                }

                /* ===========================================
                   PRODUCT DATA
                =========================================== */

                const productId =
                  item?.product_id ||
                  item?._id ||
                  item?.id ||
                  index;

                const brand =
                  item?.Brand_Name ||
                  item?.Brand ||
                  "";

                const type =
                  item?.Product_Subcategory ||
                  item?.Product_Category ||
                  item?.Category ||
                  "";

                const name =
                  item?.Product_Name ||
                  item?.product_name ||
                  "";

                const model =
                  item?.Model_number ||
                  item?.Model_Number ||
                  item?.model_number ||
                  item?.model ||
                  "";

                const mrp =
                  Math.round(
                    Number(
                      item?.MRP ||
                      0
                    )
                  );

                const cutPrice =
                  Math.round(
                    Number(
                      item?.Product_price ||
                      0
                    )
                  );

                const image =
                  item?.image_01 ||
                  item?.Product_Image ||
                  item?.image ||
                  "/no-image.png";

                const isWishlisted =
                  isProductWishlisted(
                    productId
                  );

                return (

                  <div
                    className="ecom-product-card"
                    key={
                      productId
                    }
                    onClick={() =>
                      handleProductClick(
                        item
                      )
                    }
                  >

                    {/* =====================================
                        IMAGE
                    ===================================== */}

                    <div className="ecom-product-img">

                      <img
                        src={image}
                        alt={
                          name ||
                          "Product"
                        }
                        loading="lazy"
                        onError={(
                          e
                        ) => {
                          e.currentTarget.src =
                            "/no-image.png";
                        }}
                      />

                      {/* ===================================
                          WISHLIST
                      =================================== */}

                      <button
                        type="button"
                        className={`wishlist-box ${
                          isWishlisted
                            ? "active"
                            : ""
                        }`}
                        onClick={(
                          e
                        ) =>
                          handleWishlist(
                            e,
                            item
                          )
                        }
                        aria-label={
                          isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >

                        {isWishlisted ? (
                          <IoIosHeart
                            className="wishlist-icon filled"
                          />
                        ) : (
                          <IoIosHeartEmpty
                            className="wishlist-icon"
                          />
                        )}

                      </button>

                    </div>

                    {/* =====================================
                        PRODUCT INFO
                    ===================================== */}

                    <div className="ecom-product-info">

                      {/* BRAND + RATING */}

                      <div className="ecom-brand-row">

                        <h5 className="ecom-brand">
                          {brand}
                        </h5>

                        {Number(
                          item?.totalReviews ||
                            0
                        ) > 0 &&
                          Number(
                            item?.averageRating ||
                              0
                          ) > 0 && (

                            <span className="ecom-rating">

                              <FaStar className="rating-star" />

                              {Number(
                                item.averageRating
                              ).toFixed(
                                1
                              )}

                              <span className="rating-count">
                                (
                                {
                                  item.totalReviews
                                }
                                )
                              </span>

                            </span>

                          )}

                      </div>

                      {/* MODEL */}

                      <p className="ecom-model">
                        Model -{" "}
                        {model}
                      </p>

                      {/* CATEGORY */}

                      <p className="ecom-type">
                        {type}
                      </p>

                      {/* PRICE */}

                      <div className="ecom-price-box">

                        <span className="ecom-price">
                          MRP ₹
                          {mrp.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        {cutPrice >
                          mrp && (

                          <span className="ecom-old-price">
                            ₹
                            {cutPrice.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        )}

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

        {/* ===================================================
            PAGINATION
        =================================================== */}

        {totalPages > 1 &&
          !loading && (

          <div className="pagination">

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={
                currentPage ===
                1
              }
              onClick={() =>
                changePage(
                  currentPage -
                    1
                )
              }
            >
              &lt; Prev
            </button>

            {/* PAGE NUMBERS */}

            {paginationItems.map(
              (
                page,
                index
              ) => {

                if (
                  page ===
                  "..."
                ) {
                  return (
                    <span
                      key={`dots-${index}`}
                      className="page-dots"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    type="button"
                    key={page}
                    className={
                      currentPage ===
                      page
                        ? "active-page"
                        : ""
                    }
                    onClick={() =>
                      changePage(
                        page
                      )
                    }
                  >
                    {page}
                  </button>
                );
              }
            )}

            {/* NEXT */}

            <button
              type="button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                changePage(
                  currentPage +
                    1
                )
              }
            >
              Next &gt;
            </button>

          </div>

        )}

      </div>

    </section>
  );
}