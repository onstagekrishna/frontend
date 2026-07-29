import { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const BASE_URL = "https://api.onstage.co.in/api/v1";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);

  // ✅ LOAD FROM LOCALSTORAGE (on refresh)
  useEffect(() => {
    const storedResults = localStorage.getItem("searchResults");
    const storedQuery = localStorage.getItem("searchQuery");

    if (storedResults) {
      setSearchResults(JSON.parse(storedResults));
    }

    if (storedQuery) {
      setSearchQuery(storedQuery);
    }
  }, []);

  // ✅ SAVE RESULTS TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("searchResults", JSON.stringify(searchResults));
  }, [searchResults]);

  // ✅ SAVE QUERY TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
  }, [searchQuery]);

  // 🔍 FETCH SUGGESTIONS
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoadingSuggestions(true);

      const res = await fetch(
        `${BASE_URL}/search-products?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.success && data.data) {
        const normalizedQuery = query.toLowerCase();

        // ✅ Priority 1: Subcategory
        const subcategories = data.data
          .map((item) => item.Product_Subcategory)
          .filter(
            (sub) => sub && sub.toLowerCase().includes(normalizedQuery)
          );

        if (subcategories.length > 0) {
          setSuggestions([...new Set(subcategories)]);
          return;
        }

        // ✅ Priority 2: Brand
        const brands = data.data
          .map((item) => item.Brand_Name)
          .filter(
            (brand) => brand && brand.toLowerCase().includes(normalizedQuery)
          );

        if (brands.length > 0) {
          setSuggestions([...new Set(brands)]);
          return;
        }

        // ✅ Priority 3: Product ID
        const ids = data.data
          .map((item) => item.product_id)
          .filter(
            (id) => id && id.toLowerCase().startsWith(normalizedQuery)
          );

        if (ids.length > 0) {
          setSuggestions([...new Set(ids)]);
          return;
        }

        setSuggestions([]);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Suggestion error:", error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // 🔍 MAIN SEARCH
  const handleSearch = async (customQuery) => {
    const finalQuery = customQuery || searchQuery;

    if (!finalQuery.trim()) return;

    try {
      setLoading(true);
      setNoResultsFound(false);
      setSuggestions([]);

      const res = await fetch(
        `${BASE_URL}/search-products?q=${encodeURIComponent(finalQuery)}`
      );
      const data = await res.json();

      if (data.success && data.data && data.data.length > 0) {
        setSearchResults(data.data);
        setNoResultsFound(false);
      } else {
        // 🔥 Fallback: search by product ID
        try {
          const idRes = await fetch(
            `${BASE_URL}/product/${encodeURIComponent(finalQuery)}`
          );
          const idData = await idRes.json();

          if (idData.success && idData.product) {
            setSearchResults([idData.product]);
            setNoResultsFound(false);
            return;
          }
        } catch (err) {
          console.error("ID search error:", err);
        }

        setSearchResults([]);
        setNoResultsFound(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setNoResultsFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        handleSearch,
        fetchSuggestions,
        suggestions,
        loading,
        loadingSuggestions,
        noResultsFound,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);