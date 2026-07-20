import { useEffect, useRef, useState } from "react";
import { IoMdHeartEmpty, IoMdPersonAdd, IoMdArrowDropdown } from "react-icons/io";
import { IoCartOutline, IoPersonCircleSharp } from "react-icons/io5";
import { FaBars, FaTimes, FaCartArrowDown } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoMailOutline, IoCallOutline } from "react-icons/io5";

import logo1 from "../image/logo/logo.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "./SearchBar";
import { logoutUser } from "../Redux/Slices/AuthSlice";

const productBrands = [
  "Cordoba", "Fender", "Jackson", "Shure",
  "Alesis", "Schecter", "MUSEDO", "Martin",
  "Aria", "Charvel", "Ernie Ball", "Nux",
  "Line 6", "Ludwig", "Music Man", "Orangewood",
  "Remo", "Rotosound", "Sabian", "Santana",
  "Slash", "Sonor", "Seymour Duncan", "Akai",
];

const productCategories = [
  "Effects",
  "Guitars",
  "Accessories",
  "Ukuleles",
  "Amplifiers",
  "Pro Audio and Studio",
  "Pianos and Keyboards",
  "Drums and Drum Accessories",
  "Professional Audios",
  "Harmonica",
];

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // helpers: 
  const closeMobileAndNavigate = (path) => {
    setMenuOpen(false);
    setMobileProductOpen(false);
    navigate(path);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const userData = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.Cart?.items || []);
  const wishlistItems = useSelector((state) => state.Wishlist?.items || []);

  const isAdmin = userData?.role?.toLowerCase() === "admin";
  const isUser = userData?.role?.toLowerCase() === "user";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const topbarContent = (
    <div className="topbar-content">
      <div className="left">
        <FaLocationDot /> Noida, Uttar Pradesh - 201301
      </div>

      <div className="right">
        <span>
          <IoMailOutline />
          <a href="mailto:onstagesupport@gmail.com">onstagesupport@gmail.com</a>
        </span>

        <span>
          <IoCallOutline />
          <a href="tel:+919342342334">+91 9342342334</a>
        </span>
      </div>
    </div>
  );

  const messages = [
    { class: "orange-bar", content: topbarContent },
    { class: "purple-bar", content: topbarContent },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === 0 ? 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleBrandClick = (brandName) => {
    setMenuOpen(false);
    setMobileProductOpen(false);
    document.activeElement?.blur();

    navigate(`/category?brand=${encodeURIComponent(brandName)}&page=1`);
  };
  const handleCategoryClick = (category) => {
    setMenuOpen(false);
    setMobileProductOpen(false);

    navigate(`/category?type=${encodeURIComponent(category)}&page=1`);
  };
  // const handleLogout = async () => {
  //   try {
  //     await fetch("https://api.onstage.co.in/api/v1/logout", {
  //       method: "POST",
  //       credentials: "include",
  //     });
  //   } catch (err) {
  //     console.error("Logout API Error:", err);
  //   }

  //   dispatch(logoutUser());

  //   // Clear complete localStorage
  //   localStorage.clear();

  //   // Clear complete sessionStorage
  //   sessionStorage.clear();

  //   setDropdownOpen(false);
  //   setMenuOpen(false);

  //   navigate("/login", { replace: true });

  //   // Refresh app state
  //   window.location.reload();
  // };

  const handleLogout = async () => {
    try {
      await fetch("https://api.onstage.co.in/api/v1/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout API Error:", err);
    }

    dispatch(logoutUser());

    // Remove only required localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rzp_stored_checkout_id");

    // Clear sessionStorage if needed
    sessionStorage.clear();

    setDropdownOpen(false);
    setMenuOpen(false);

    navigate("/login", { replace: true });

    window.location.reload();
  };

  return (
    <>
      <div className={`topbar ${messages[current].class}`}>
        {messages[current].content}
      </div>

      <header className="navbar">
        <div className="nav-wrapper">
          <div className="nav-left desktop-only">
            <span onClick={() => navigate("/")}>Home</span>
            <span onClick={() => navigate("/AboutUs")}>About Us</span>

            <div className="os-products-menu">
              <span className="os-products-trigger">
                Our Brands <IoMdArrowDropdown />
              </span>

              <div className="os-products-mega">
                {productBrands.map((brand) => (
                  <button
                    type="button"
                    key={brand}
                    onClick={() => handleBrandClick(brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="nav-center" onClick={() => navigate("/")}>
            <img src={logo1} alt="logo" />
          </div>

          <div className="nav-right desktop-only">
            <div className="search-box">
              <SearchBar />
            </div>

            {!isAdmin && (
              <>
                <div className="mobile-icon" onClick={() => navigate("/wishlist")}>
                  <IoMdHeartEmpty />
                  {wishlistItems.length > 0 && (
                    <span className="badge">{wishlistItems.length}</span>
                  )}
                </div>

                <div
                  className="mobile-icon"
                  onClick={() => navigate("/cart")}
                >
                  <IoCartOutline />
                  {cartItems.length > 0 && (
                    <span className="badge">{cartItems.length}</span>
                  )}
                </div>
              </>
            )}

            <div className="user-menu" ref={dropdownRef}>
              <div
                className="user-box"
                onClick={() => {
                  if (!userData) {
                    navigate("/login");
                  } else {
                    setDropdownOpen(!dropdownOpen);
                  }
                }}
              >
                {userData ? (
                  <>
                    <IoPersonCircleSharp />
                    <span>
                      {userData.firstName?.split(" ")[0]}
                    </span>
                  </>
                ) : (
                  <>
                    <IoMdPersonAdd />
                    <span>Login</span>
                  </>
                )}
              </div>

              {userData && dropdownOpen && (
                <div className="dropdown show">
                  {isUser && (
                    <>
                      <div onClick={() => navigate("/profile")}>
                        <CgProfile /> My Profile
                      </div>

                      <div onClick={() => navigate("/orders")}>
                        <FaCartArrowDown /> My Orders
                      </div>

                      <div onClick={handleLogout} className="logout">
                        <IoIosLogOut /> Logout
                      </div>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <div onClick={() => navigate("/admin/dashboard")}>
                        <MdDashboard /> Dashboard
                      </div>

                      <div onClick={handleLogout} className="logout">
                        <IoIosLogOut /> Logout
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mobile-header mobile-only">

            <div
              className="mobile-logo"
              onClick={() => navigate("/")}
            >
              <img src={logo1} alt="logo" />
            </div>

            <div className="mobile-icons">

              {!isAdmin && (
                <>
                  <div
                    className="mobile-icon"
                    onClick={() => navigate("/wishlist")}
                  >
                    <IoMdHeartEmpty />
                    {wishlistItems.length > 0 && (
                      <span className="badge">
                        {wishlistItems.length}
                      </span>
                    )}
                  </div>

                  <div
                    className="mobile-icon"
                    onClick={() => navigate("/cart")}
                  >
                    <IoCartOutline />
                    {cartItems.length > 0 && (
                      <span className="badge">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                </>
              )}



              <div
                className="mobile-icon"
                onClick={() => setMenuOpen(true)}
              >
                <FaBars />
              </div>

            </div>

          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
        <div className="mobile-close">
          <FaTimes onClick={() => setMenuOpen(false)} />
        </div>

        <ul>
          <li
            onClick={() => {
              setSearchOpen(true);
              setMenuOpen(false);
            }}
          >
            <IoSearchOutline
              style={{ marginRight: "8px", verticalAlign: "middle" }}
            />
            Search
          </li>
          <li onClick={() => closeMobileAndNavigate("/")}>Home</li>
          <li onClick={() => closeMobileAndNavigate("/AboutUs")}>About Us</li>

          <li
            className="mobile-products-title"
            onClick={() => setMobileProductOpen(!mobileProductOpen)}
          >
            Our Products <IoMdArrowDropdown />
          </li>

          {mobileProductOpen && (
            <div className="mobile-brand-list">
              {productCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* {!isAdmin && (
            <>
              <li onClick={() => closeMobileAndNavigate("/wishlist")}>Wishlist</li>
              <li onClick={() => closeMobileAndNavigate("/cart")}>Cart</li>
            </>
          )} */}

          {userData ? (
            <>
              {isUser && (
                <>
                  <li onClick={() => closeMobileAndNavigate("/profile")}>My Profile</li>
                  <li onClick={() => closeMobileAndNavigate("/orders")}>My Orders</li>
                </>
              )}

              {isAdmin && (
                <li onClick={() => closeMobileAndNavigate("/admin/dashboard")}>
                  Dashboard
                </li>
              )}

              <li onClick={handleLogout}>Logout</li>
            </>
          ) : (
            <li onClick={() => closeMobileAndNavigate("/login")}>Login</li>
          )}
        </ul>
      </div>
      {searchOpen && (
        <div
          className="search-modal-overlay"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="search-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-modal-header">
              <span>Search Products</span>

              <FaTimes
                className="close-icon"
                onClick={() => setSearchOpen(false)}
              />
            </div>

            <SearchBar onSelect={() => setSearchOpen(false)} />

          </div>
        </div>
      )}
    </>
  );
}

export default Header;