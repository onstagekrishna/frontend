import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../Redux/Slices/WishlistSlice";
import {
  IoIosHeart,
  IoIosHeartEmpty,
} from "react-icons/io";

const tabs = [
  {
    label: "ACOUSTIC GUITARS",
    type: "Acoustic Guitars",
  },
  {
    label: "ELECTRIC GUITARS",
    type: "Electric Guitars",
  },
  {
    label: "AMPLIFIERS",
    type: "Amplifiers",
  },
  {
    label: "MPC",
    type: "MPC",
  },
  {
    label: "CONTROLLERS",
    type: "Controllers",
  },
  {
    label: "PIANO & KEYBOARDS",
    type: "Piano & Keyboards",
  },
  {
    label: "GUITARS STRING",
    type: "String",
  },
  {
    label: "STRAPS",
    type: "Straps",
  },
];

const AllProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.Wishlist?.items || []
  );

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fade, setFade] = useState(false);

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (value) => {
    return Math.round(
      Number(value || 0)
    ).toLocaleString("en-IN");
  };

  // ==========================================
  // GET PRODUCT ID
  // ==========================================

  const getProductId = (item) => {
    return (
      item?._id ||
      item?.product_id ||
      item?.id
    );
  };

  // ==========================================
  // GET PRICE
  // ==========================================

  const getPrice = (item) => {
    return Number(
      item?.price ||
        item?.Product_price ||
        0
    );
  };

  // ==========================================
  // GET STOCK
  // ==========================================

  const getStock = (item) => {
    const stock =
      item?.Product_Quantity ??
      item?.stock ??
      item?.quantity;

    if (
      stock === undefined ||
      stock === null ||
      stock === ""
    ) {
      return 1;
    }

    return Number(stock);
  };

  // ==========================================
  // BRAND-WISE PRODUCT ARRANGEMENT
  // ==========================================
  //
  // Example:
  //
  // Martin
  // Cort
  // Fender
  // Yamaha
  //
  // Martin
  // Cort
  // Fender
  // Yamaha
  //
  // Martin
  // Cort
  // Fender
  //
  // Isse same brand ke products
  // continuously nahi aayenge.
  // ==========================================

  const arrangeProductsByBrand = (items) => {
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return [];
    }

    const brandGroups = {};

    items.forEach((item) => {
      const brandName = String(
        item?.Brand_Name ||
          item?.brand_name ||
          item?.brand ||
          "Other"
      ).trim();

      const brandKey =
        brandName.toLowerCase();

      if (!brandGroups[brandKey]) {
        brandGroups[brandKey] = {
          name: brandName,
          products: [],
        };
      }

      brandGroups[
        brandKey
      ].products.push(item);
    });

    const brands =
      Object.keys(brandGroups);

    const arrangedProducts = [];

    let round = 0;

    while (true) {
      let addedProduct = false;

      brands.forEach((brandKey) => {
        const brandProducts =
          brandGroups[brandKey]
            .products;

        if (brandProducts[round]) {
          arrangedProducts.push(
            brandProducts[round]
          );

          addedProduct = true;
        }
      });

      if (!addedProduct) {
        break;
      }

      round++;
    }

    return arrangedProducts;
  };

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProductsByType = async (tab) => {
    try {
      setFade(true);
      setLoading(true);

      const res = await fetch(
        `https://api.onstage.co.in/api/v1/categoryProduct?type=${encodeURIComponent(
          tab.type
        )}`
      );

      if (!res.ok) {
        throw new Error(
          `API Error: ${res.status}`
        );
      }

      const data = await res.json();

      console.log(
        "Category API Response:",
        data
      );

      const arr =
        data?.data ||
        data?.products ||
        [];

      // ========================================
      // FILTER VALID PRODUCTS
      // ========================================

      const filteredProducts =
        Array.isArray(arr)
          ? arr.filter((item) => {
              return (
                item?.Model_number &&
                String(
                  item.Model_number
                ).trim() !== ""
              );
            })
          : [];

      // ========================================
      // BRAND-WISE ARRANGEMENT
      // ========================================

      const arrangedProducts =
        arrangeProductsByBrand(
          filteredProducts
        );

      console.log(
        "Brand-wise Products:",
        arrangedProducts
      );

      setTimeout(() => {
        setProducts(
          arrangedProducts
        );

        setLoading(false);
        setFade(false);
      }, 500);
    } catch (err) {
      console.error(
        "Products Fetch Error:",
        err
      );

      setProducts([]);
      setLoading(false);
      setFade(false);
    }
  };

  // ==========================================
  // CATEGORY CLICK
  // ==========================================

  const handleCategoryClick = (
    tab,
    index
  ) => {
    setActiveTab(tab);
    setActiveIndex(index);

    fetchProductsByType(tab);
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTab(tabs[0]);
      setActiveIndex(0);

      fetchProductsByType(
        tabs[0]
      );
    }
  }, []);

  // ==========================================
  // FIRST 20 PRODUCTS
  // ==========================================

  const visibleProducts = useMemo(() => {
    return products.slice(0, 20);
  }, [products]);

  // ==========================================
  // PRODUCT DETAILS
  // ==========================================

  const handlePage = (item) => {
    const id =
      getProductId(item);

    if (!id) {
      return;
    }

    navigate(
      `/productDetails/${id}`,
      {
        state: item,
      }
    );
  };

  // ==========================================
  // VIEW MORE
  // ==========================================

  const handleViewMore = () => {
    navigate("/category", {
      state: {
        type: activeTab.type,
        onlyMainProducts: true,
        hideAccessories: true,
      },
    });
  };

  // ==========================================
  // WISHLIST
  // ==========================================

  const handleWishlist = (
    e,
    item,
    productId,
    isWishlisted
  ) => {
    e.stopPropagation();

    if (!productId) {
      return;
    }

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

  // ==========================================
  // UI
  // ==========================================

  return (
    <section className="ecom-products-section">
      <div className="guitar-products-container">

        {/* =================================
            HEADER
        ================================= */}

        <div className="guitar-section-header">
          <h2 className="guitar-section-heading">
            SHOP MUSICAL ESSENTIALS
          </h2>

          <p className="guitar-section-tagline">
            Quality instruments and
            accessories for every musician.
          </p>
        </div>

        {/* =================================
            TABS
        ================================= */}

        <div className="guitar-tabs">
          {tabs.map(
            (tab, index) => (
              <button
                type="button"
                key={tab.label}
                className={`guitar-tab-btn ${
                  activeIndex === index
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleCategoryClick(
                    tab,
                    index
                  )
                }
              >
                {tab.label}
              </button>
            )
          )}
        </div>

        {/* =================================
            PRODUCTS
        ================================= */}

        {loading ? (
          <div className="loading-gif-on-product-change">
            <img
              src="https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/new%20mackie%20product/Onstage-loading.gif"
              alt="Loading products..."
            />
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="no-products">

            <img
              src="https://pub-1cfbd62bb18344a08190c13684f63517.r2.dev/274/Gemini_Generated_Image_juv4kfjuv4kfjuv4%201-Photoroom.png"
              alt="No Products Available"
              className="no-products-img"
            />

            <h3 className="no-products-title">
              No Products Available
            </h3>

            <p className="no-products-text">
              Products will be available
              in this category soon.
              Please check back later.
            </p>

          </div>
        ) : (
          <div
            className={`ecom-products-grid fade-container ${
              fade
                ? "fade-out"
                : "fade-in"
            }`}
          >

            {visibleProducts.map(
              (item, index) => {
                const productId =
                  getProductId(item);

                const mrp = Number(
                  item?.MRP || 0
                );

                const cutPrice =
                  Number(
                    item?.Product_price ||
                      0
                  );

                const brandName =
                  item?.Brand_Name ||
                  item?.brand_name ||
                  item?.brand ||
                  "Brand";

                const isWishlisted =
                  Array.isArray(
                    wishlistItems
                  ) &&
                  wishlistItems.some(
                    (w) =>
                      (
                        w?.product_id ||
                        w?._id ||
                        w?.id
                      ) === productId
                  );

                return (
                  <div
                    className="ecom-product-card"
                    key={
                      productId ||
                      `${brandName}-${index}`
                    }
                    onClick={() =>
                      handlePage(item)
                    }
                  >

                    {/* =================================
                        PRODUCT IMAGE
                    ================================= */}

                    <div className="ecom-product-img">

                      {/* WISHLIST */}

                      <button
                        type="button"
                        aria-label={
                          isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        className={`wishlist-box ${
                          isWishlisted
                            ? "active"
                            : ""
                        }`}
                        onClick={(e) =>
                          handleWishlist(
                            e,
                            item,
                            productId,
                            isWishlisted
                          )
                        }
                      >
                        {isWishlisted ? (
                          <IoIosHeart className="wishlist-icon filled" />
                        ) : (
                          <IoIosHeartEmpty className="wishlist-icon" />
                        )}
                      </button>

                      {/* PRODUCT IMAGE */}

                      <img
                        src={
                          item?.image_01 ||
                          item?.image ||
                          "/no-image.png"
                        }
                        alt={
                          item?.name ||
                          item?.Product_Name ||
                          item?.Model_number ||
                          "Product"
                        }
                        loading="lazy"
                        onMouseEnter={(e) => {
                          if (
                            item?.image_02
                          ) {
                            e.currentTarget.src =
                              item.image_02;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.src =
                            item?.image_01 ||
                            item?.image ||
                            "/no-image.png";
                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "/no-image.png";
                        }}
                      />

                    </div>

                    {/* =================================
                        PRODUCT INFO
                    ================================= */}

                    <div className="ecom-product-info">

                      <h5 className="ecom-brand">
                        {brandName}
                      </h5>

                      <p className="ecom-model">
                        Model -{" "}
                        {item?.Model_number}
                      </p>

                      <p className="ecom-type">
                        {item?.Product_Category ||
                          activeTab.type}
                      </p>

                      <div className="ecom-price-box">

                        <span className="ecom-price">
                          MRP ₹
                          {formatPrice(
                            mrp
                          )}
                        </span>

                        {Number(
                          item?.totalReviews ||
                            0
                        ) > 0 && (
                          <span className="ecom-rating">
                            <FaStar className="rating-star" />

                            {Number(
                              item?.averageRating ||
                                0
                            ).toFixed(1)}

                            {" "}
                            (
                            {
                              item?.totalReviews
                            }
                            )
                          </span>
                        )}

                        {cutPrice > mrp &&
                          mrp > 0 && (
                            <span className="ecom-old-price">
                              ₹
                              {formatPrice(
                                cutPrice
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

        {/* =================================
            VIEW MORE
        ================================= */}

        {/* {visibleProducts.length > 0 && (
          // <div className="guitar-view-more-wrapper">
          //   <button
          //     type="button"
          //     className="guitar-view-more-btn"
          //     onClick={handleViewMore}
          //   >
          //     View More
          //     <span>→</span>
          //   </button>
          // </div>
        )} */}

      </div>
    </section>
  );
};

export default AllProducts;