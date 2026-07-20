import { useState, useEffect, useRef } from "react";
import { useSearch } from "../context/SearchContext";
import { VscSearch } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";

function SearchBar({ onSelect }) {
  const { setSearchQuery, handleSearch } = useSearch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const wrapperRef = useRef(null);

  // Load history
  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(savedHistory);
  }, []);

  // Hide history when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const saveSearchHistory = (searchTerm) => {
    let savedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Remove duplicate
    savedHistory = savedHistory.filter(
      (item) => item.toLowerCase() !== searchTerm.toLowerCase()
    );

    // Add latest search on top
    savedHistory.unshift(searchTerm);

    // Keep only last 10 searches
    savedHistory = savedHistory.slice(0, 10);

    localStorage.setItem(
      "searchHistory",
      JSON.stringify(savedHistory)
    );

    setHistory(savedHistory);
  };
  const removeHistory = (searchItem) => {
    const updatedHistory = history.filter(
      (item) => item !== searchItem
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      "searchHistory",
      JSON.stringify(updatedHistory)
    );

    if (updatedHistory.length === 0) {
      setShowHistory(false);
    }
  };
  const handleSearchClick = (searchTerm) => {
    const trimmedQuery = searchTerm.trim();

    if (!trimmedQuery) return;

    saveSearchHistory(trimmedQuery);

    setSearchQuery(trimmedQuery);
    handleSearch();

    // Close history
    setShowHistory(false);

    // Clear input after search
    setQuery("");
    onSelect?.();

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <div className="kr-search-wrapper" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Search for instruments..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSearchQuery(e.target.value);
        }}
        onFocus={() => {
          if (history.length > 0) {
            setShowHistory(true);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearchClick(query);
          }
        }}
        className="kr-search-input"
      />



      <button
        className="kr-search-btn"
        onClick={() => handleSearchClick(query)}
      >
        <img
          src="https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/download.gif"
          alt="Search"
          className="kr-search-gif"
        />
      </button>

      {showHistory && history.length > 0 && (
        <div className="kr-search-history">
          {history.map((item, index) => (
            <div key={index} className="kr-history-item">

              <div
                className="kr-history-left"
                onClick={() => handleSearchClick(item)}
              >
                <VscSearch />
                <span>{item}</span>
              </div>

              <button
                className="kr-history-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  removeHistory(item);
                }}
              >
                <MdClose />
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;