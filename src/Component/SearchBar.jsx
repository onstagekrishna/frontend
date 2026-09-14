import { useState, useEffect, useRef } from "react";
import { useSearch } from "../context/SearchContext";
import { VscSearch } from "react-icons/vsc";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";


function SearchBar({ onSelect }) {
  const { setSearchQuery, handleSearch } = useSearch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const normalizeSearch = (value = "") =>
    value
      .toString()
      .toLowerCase()
      .replace(/[\s\-_./\\]+/g, "")
      .replace(/[^a-z0-9]/g, "");

  /* Load search history */
  useEffect(() => {
    try {
      const savedHistory =
        JSON.parse(localStorage.getItem("searchHistory")) || [];

      if (Array.isArray(savedHistory)) {
        setHistory(savedHistory);
      }
    } catch {
      setHistory([]);
    }
  }, []);

  /* Close history when clicked outside */
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
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const saveSearchHistory = (searchTerm) => {
    let savedHistory = [];

    try {
      savedHistory =
        JSON.parse(localStorage.getItem("searchHistory")) || [];
    } catch {
      savedHistory = [];
    }

    if (!Array.isArray(savedHistory)) {
      savedHistory = [];
    }

    savedHistory = savedHistory.filter(
      (item) =>
        normalizeSearch(item) !== normalizeSearch(searchTerm)
    );

    savedHistory.unshift(searchTerm);
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

  const closeKeyboardAndSearch = () => {
    requestAnimationFrame(() => {
      inputRef.current?.blur();
    });
  };

  const handleSearchClick = (searchTerm) => {
    const originalQuery = searchTerm.trim();

    if (!originalQuery) {
      inputRef.current?.focus();
      return;
    }

    const normalizedQuery = normalizeSearch(originalQuery);

    saveSearchHistory(originalQuery);

    setSearchQuery(normalizedQuery);

    const compactModel =
      normalizedQuery.match(/^([a-z]+)(\d.*)$/);

    const backendQuery = compactModel
      ? compactModel[1]
      : originalQuery;

    handleSearch(backendQuery);

    setShowHistory(false);
    setQuery("");

    closeKeyboardAndSearch();

    onSelect?.();

    navigate(
      `/search?q=${encodeURIComponent(originalQuery)}`
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    setQuery(value);
    setSearchQuery(normalizeSearch(value));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick(query);
    }
  };

  return (
    <div
      className="kr-search-wrapper"
      ref={wrapperRef}
    >
      <div className="kr-search-box">
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          value={query}
          placeholder="Search for instruments..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          className="kr-search-input"
          onChange={handleInputChange}
          onFocus={() => {
            if (history.length > 0) {
              setShowHistory(true);
            }
          }}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className="kr-search-btn"
          aria-label="Search"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleSearchClick(query)}
        >
          <img
            src="https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/download.gif"
            alt="Search"
            className="kr-search-gif"
          />
        </button>
      </div>

      {showHistory && history.length > 0 && (
        <div className="kr-search-history">
          {history.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="kr-history-item"
            >
              <button
                type="button"
                className="kr-history-left"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  handleSearchClick(item)
                }
              >
                <VscSearch />
                <span>{item}</span>
              </button>

              <button
                type="button"
                className="kr-history-delete"
                aria-label={`Remove ${item}`}
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