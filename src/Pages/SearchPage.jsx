import React, { useEffect, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
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

  /* ================= NORMALIZE ================= */

  const normalizeText = (value = "") =>
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();

  /* ================= URL SEARCH ================= */

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = (params.get("q") || "").trim();

    if (!query) return;

    const normalizedQuery = normalizeText(query);

    setSearchQuery(normalizedQuery);

    /*
      MG30 / MG-30 / MG 30
      ↓
      mg30
      ↓
      backend search = mg
      ↓
      MG products milenge
      ↓
      frontend MG-30 filter karega
    */

    const compactModel = normalizedQuery.match(
      /^([a-z]+)(\d.*)$/
    );

    if (compactModel) {
      handleSearch(compactModel[1]);
    } else {
      handleSearch(query);
    }
  }, [location.search]);

  /* ================= CURRENT QUERY ================= */

  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);

    return normalizeText(
      params.get("q") || ""
    );
  }, [location.search]);

  /* ================= SMART FILTER ================= */

  const filteredSearchResults = useMemo(() => {
    if (!Array.isArray(searchResults)) {
      return [];
    }

    if (!searchQuery) {
      return searchResults;
    }

    const params = new URLSearchParams(location.search);
    const originalQuery =
      params.get("q") || "";

    const queryWords = originalQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(normalizeText)
      .filter(Boolean);

    const results = searchResults
      .map((item) => {
        if (!item) return null;

        /* ================= SEARCH FIELDS ================= */

        const brand = normalizeText(
          item.Brand_Name ||
          item.Brand ||
          item.brand ||
          item.brand_name
        );

        const name = normalizeText(
          item.Product_Name ||
          item.product_name ||
          item.Name
        );

        const model = normalizeText(
          item.Model_number ||
          item.Model_Number ||
          item.model_number ||
          item.model
        );

        const category = normalizeText(
          item.Product_Category ||
          item.product_category ||
          item.Category
        );

        const subCategory = normalizeText(
          item.Product_Subcategory ||
          item.product_subcategory ||
          item.Subcategory
        );

        const description = normalizeText(
          item.Product_Description ||
          item.product_description ||
          item.description ||
          item.Description
        );

        const productType = normalizeText(
          item.Product_Type ||
          item.product_type ||
          item.Type
        );

        const sku = normalizeText(
          item.SKU ||
          item.sku ||
          item.Product_Code ||
          item.product_code
        );

        /* ================= ALL SEARCHABLE DATA ================= */

        const searchableText = [
          brand,
          name,
          model,
          category,
          subCategory,
          description,
          productType,
          sku,
        ]
          .filter(Boolean)
          .join(" ");

        /* ================= DIRECT MATCH ================= */

        const directMatch =
          searchableText.includes(searchQuery);

        /* ================= WORD MATCH ================= */

        const allWordsMatch =
          queryWords.length > 0 &&
          queryWords.every((word) =>
            searchableText.includes(word)
          );

        if (!directMatch && !allWordsMatch) {
          return null;
        }

        /* ================= SCORE ================= */

        let score = 0;

        if (model === searchQuery) {
          score += 250;
        }

        if (name === searchQuery) {
          score += 220;
        }

        if (model.includes(searchQuery)) {
          score += 180;
        }

        if (name.includes(searchQuery)) {
          score += 150;
        }

        if (brand === searchQuery) {
          score += 100;
        }

        if (brand.includes(searchQuery)) {
          score += 80;
        }

        if (category === searchQuery) {
          score += 70;
        }

        if (category.includes(searchQuery)) {
          score += 60;
        }

        if (subCategory.includes(searchQuery)) {
          score += 50;
        }

        if (sku.includes(searchQuery)) {
          score += 40;
        }

        if (description.includes(searchQuery)) {
          score += 20;
        }

        /* ================= GUITAR SEARCH ================= */

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
            "gigbag",
            "accessories",
          ];

          const isActualGuitar =
            name.includes("guitar") ||
            category.includes("guitar") ||
            subCategory.includes("guitar");

          const isAccessory =
            accessoryWords.some(
              (word) =>
                name.includes(word) ||
                category.includes(word) ||
                subCategory.includes(word)
            );

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
      .sort((a, b) => b.score - a.score)
      .map((result) => result.item);

    return results;
  }, [
    searchResults,
    searchQuery,
    location.search,
  ]);

  /* ================= PRODUCT CLICK ================= */

  const handleProductClick = (product) => {
    if (!product) return;

    const identifier =
      slugify(product.Product_Name) ||
      product.product_id;

    if (!identifier) return;

    navigate(
      `/productDetails/${identifier}`,
      {
        state: product,
      }
    );
  };

  /* ================= LOADING ================= */

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

  /* ================= NO PRODUCTS ================= */

  if (
    !loading &&
    filteredSearchResults.length === 0
  ) {
    const originalQuery =
      new URLSearchParams(
        location.search
      ).get("q") || "";

    return (
      <div className="no-products-found">
        <img
          src="https://pub-1cfbd62bb18344a08190c13684f63517.r2.dev/274/Gemini_Generated_Image_juv4kfjuv4kfjuv4%201-Photoroom.png"
          alt="No products"
          className="no-products-img"
        />

        <h2>No Products Found</h2>

        <p>
          No products found for "{originalQuery}"
        </p>

        <button
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  /* ================= PRODUCTS ================= */

  return (
    <section className="ecom-products-section">
      <div className="container">

        <h2 className="ecom-products-heading">
          Search Results
        </h2>

        <div className="ecom-products-grid">

          {filteredSearchResults.map(
            (item, index) => {

              if (!item) return null;

              const brand =
                item?.Brand_Name ||
                item?.Brand ||
                item?.brand ||
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

              const mrp = Math.round(
                Number(item?.MRP || 0)
              );

              const oldPrice = Math.round(
                Number(
                  item?.Product_price || 0
                )
              );

              const image =
                item?.image_01 ||
                item?.Product_Image ||
                item?.image ||
                "/no-image.png";

              const id =
                item?.product_id ||
                item?._id ||
                item?.id;

              /* ================= WISHLIST ================= */

              const isWishlisted =
                Array.isArray(wishlistItems) &&
                wishlistItems.some(
                  (w) =>
                    String(
                      w?.product_id ||
                      w?._id ||
                      w?.id
                    ) === String(id)
                );

              return (
                <div
                  className="ecom-product-card"
                  key={id || index}
                  onClick={() =>
                    handleProductClick(item)
                  }
                >

                  {/* IMAGE */}

                  <div
                    className="ecom-product-img"
                    style={{
                      position: "relative",
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

                        if (!id) return;

                        if (isWishlisted) {
                          dispatch(
                            removeFromWishlist(id)
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
                              product_id: id,
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
                        item?.totalReviews || 0
                      ) > 0 &&
                        Number(
                          item?.averageRating || 0
                        ) > 0 && (

                          <span className="ecom-rating">

                            <span className="rating-star">
                              ★
                            </span>

                            {Number(
                              item.averageRating
                            ).toFixed(1)}

                            <span className="rating-count">
                              ({item.totalReviews})
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