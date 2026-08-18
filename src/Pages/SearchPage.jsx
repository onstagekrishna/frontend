import React, { useEffect, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";

// ❤️ ICONS
import {
  IoIosHeart,
  IoIosHeartEmpty,
} from "react-icons/io";

// 🔥 REDUX
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  addToWishlist,
  removeFromWishlist,
} from "../Redux/Slices/WishlistSlice";

export default function SearchPage() {
  const {
    searchResults,
    loading,
    setSearchQuery,
    handleSearch,
  } = useSearch();

  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.Wishlist?.items || []
  );

  // ==========================================
  // URL BASED SEARCH
  // ==========================================

  useEffect(() => {
    const params = new URLSearchParams(
      location.search
    );

    const query = params.get("q");

    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [location.search]);

  // ==========================================
  // NORMALIZE TEXT
  // ==========================================

  const normalizeText = (value) => {
    return String(value || "")
      .toLowerCase()
      .replace(/[-_/]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // ==========================================
  // SEARCH QUERY
  // ==========================================

  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(
      location.search
    );

    return normalizeText(
      params.get("q") || ""
    );
  }, [location.search]);

  // ==========================================
  // STRICT SEARCH FILTER
  // ==========================================

  const filteredSearchResults = useMemo(() => {
    if (!Array.isArray(searchResults)) {
      return [];
    }

    if (!searchQuery) {
      return searchResults;
    }

    const queryWords = searchQuery
      .split(" ")
      .filter(Boolean);

    const results = searchResults
      .map((item) => {
        if (!item) return null;

        const brand = normalizeText(
          item.Brand_Name
        );

        const name = normalizeText(
          item.Product_Name
        );

        const model = normalizeText(
          item.Model_number
        );

        const category = normalizeText(
          item.Product_Category
        );

        const subCategory = normalizeText(
          item.Product_Subcategory
        );

        // ======================================
        // ALL SEARCHABLE DATA
        // ======================================

        const searchableText = [
          brand,
          name,
          model,
          category,
          subCategory,
        ]
          .filter(Boolean)
          .join(" ");

        // ======================================
        // EVERY QUERY WORD MUST MATCH
        // ======================================

        const allWordsMatch =
          queryWords.every((word) =>
            searchableText.includes(word)
          );

        if (!allWordsMatch) {
          return null;
        }

        // ======================================
        // RELEVANCE SCORE
        // ======================================

        let score = 0;

        // Exact product name
        if (
          name === searchQuery
        ) {
          score += 100;
        }

        // Product name starts with search
        if (
          name.startsWith(searchQuery)
        ) {
          score += 80;
        }

        // Category exact match
        if (
          category === searchQuery
        ) {
          score += 70;
        }

        // Subcategory exact match
        if (
          subCategory === searchQuery
        ) {
          score += 65;
        }

        // Brand exact match
        if (
          brand === searchQuery
        ) {
          score += 60;
        }

        // Model exact match
        if (
          model === searchQuery
        ) {
          score += 55;
        }

        // Product name contains query
        if (
          name.includes(searchQuery)
        ) {
          score += 40;
        }

        // Category contains query
        if (
          category.includes(searchQuery)
        ) {
          score += 30;
        }

        // Subcategory contains query
        if (
          subCategory.includes(searchQuery)
        ) {
          score += 25;
        }

        // Brand contains query
        if (
          brand.includes(searchQuery)
        ) {
          score += 20;
        }

        // ======================================
        // GENERIC GUITAR SEARCH
        // ======================================
        //
        // "guitar" search par actual guitar
        // products ko accessories se upar rakho.
        //
        // ======================================

        if (
          searchQuery === "guitar" ||
          searchQuery === "guitars"
        ) {
          const accessoryWords = [
            "string",
            "strings",
            "cable",
            "cables",
            "strap",
            "straps",
            "pickup",
            "pick",
            "capo",
            "case",
            "cover",
            "stand",
            "bag",
            "gig bag",
            "accessories",
          ];

          const isAccessory =
            accessoryWords.some(
              (word) =>
                name.includes(word) ||
                category.includes(word) ||
                subCategory.includes(word)
            );

          const isActualGuitar =
            name.includes("guitar") ||
            category.includes("guitar") ||
            subCategory.includes("guitar");

          if (isActualGuitar) {
            score += 100;
          }

          if (isAccessory) {
            score -= 100;
          }
        }

        return {
          item,
          score,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) => b.score - a.score
      )
      .map((result) => result.item);

    return results;
  }, [
    searchResults,
    searchQuery,
  ]);

  // ==========================================
  // PRODUCT CLICK
  // ==========================================

  const handleProductClick = (
    product
  ) => {
    if (!product) return;

    const identifier = slugify(product.Product_Name) || product.product_id;
    if (!identifier) return;

    navigate(
      `/productDetails/${identifier}`,
      {
        state: product,
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <h2
        style={{
          textAlign: "center",
          padding: "60px 20px",
        }}
      >
        Loading...
      </h2>
    );
  }

  // ==========================================
  // NO PRODUCT
  // ==========================================

  if (
    !loading &&
    filteredSearchResults.length === 0
  ) {
    return (
      <div className="no-products-found">

        <img
          src="https://pub-1cfbd62bb18344a08190c13684f63517.r2.dev/274/Gemini_Generated_Image_juv4kfjuv4kfjuv4%201-Photoroom.png"
          alt="No products"
          className="no-products-img"
        />

        <h2>
          No Products Found
        </h2>

        <p>
          No products found for "
          {searchQuery}"
        </p>

        <button
          className="back-home-btn"
          onClick={() =>
            navigate("/")
          }
        >
          Back to Home
        </button>

      </div>
    );
  }

  // ==========================================
  // PRODUCTS
  // ==========================================

  return (
    <section className="ecom-products-section">

      <div className="container">

        <h2 className="ecom-products-heading">
          Search Results
        </h2>

        <div className="ecom-products-grid">

          {filteredSearchResults.map(
            (item, index) => {

              if (!item) {
                return null;
              }

              const brand =
                item?.Brand_Name || "";

              const type =
                item?.Product_Subcategory ||
                item?.Product_Category ||
                "";

              const name =
                item?.Product_Name || "";

              const model =
                item?.Model_number || "";

              const mrp = Math.round(
                Number(
                  item?.MRP || 0
                )
              );

              const oldPrice =
                Math.round(
                  Number(
                    item?.Product_price || 0
                  )
                );

              const image =
                item?.image_01 ||
                item?.Product_Image ||
                "/no-image.png";

              const id =
                item?.product_id ||
                item?._id ||
                item?.id;

              // ====================================
              // WISHLIST
              // ====================================

              const isWishlisted =
                Array.isArray(
                  wishlistItems
                ) &&
                wishlistItems.some(
                  (w) =>
                    String(
                      w?.product_id ||
                        w?._id ||
                        w?.id
                    ) ===
                    String(id)
                );

              return (
                <div
                  className="ecom-product-card"
                  key={id || index}
                  onClick={() =>
                    handleProductClick(
                      item
                    )
                  }
                >

                  {/* IMAGE */}

                  <div
                    className="ecom-product-img"
                    style={{
                      position:
                        "relative",
                    }}
                  >

                    <img
                      src={image}
                      alt={
                        name ||
                        brand ||
                        "Product"
                      }
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/no-image.png";
                      }}
                    />

                    {/* WISHLIST */}

                    <div
                      className={`wishlist-box ${
                        isWishlisted
                          ? "active"
                          : ""
                      }`}
                      onClick={(e) => {

                        e.stopPropagation();

                        if (!id) {
                          return;
                        }

                        if (
                          isWishlisted
                        ) {

                          dispatch(
                            removeFromWishlist(
                              id
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
                              product_id:
                                id,
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

                      }}
                    >

                      {isWishlisted ? (
                        <IoIosHeart
                          size={22}
                          color="red"
                        />
                      ) : (
                        <IoIosHeartEmpty
                          size={22}
                        />
                      )}

                    </div>

                  </div>

                  {/* PRODUCT INFO */}

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

                            <span className="rating-star">
                              ★
                            </span>

                            {Number(
                              item.averageRating
                            ).toFixed(1)}

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
                      Model - {model}
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

                      {oldPrice > mrp && (
                        <span className="ecom-old-price">
                          ₹
                          {oldPrice.toLocaleString(
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

      </div>

    </section>
  );
}