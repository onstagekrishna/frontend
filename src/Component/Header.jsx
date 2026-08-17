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
  {
    name: "Cordoba",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/0_Logo_Cordoba_Blue%2BCordoba%2Bwith%2BArches-large.png",
  },
  {
    name: "Fender",
    logo: "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/fender_logo.svg",
  },
  {
    name: "Jackson",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/1280px-Jackson_guitars_logo.svg.png",
  },
  {
    name: "Shure",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/1280px-Shure_Logo.svg.png",
  },
  {
    name: "Alesis",
    logo: "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/images.png",
  },
  {
    name: "Schecter",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/296-2962465_schecter-guitar-reasearch-schecter-guitar-research-logo.png",
  },
  {
    name: "MUSEDO",
    logo: "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/Logo-brand-Musedo.jpg",
  },
  {
    name: "Martin",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/800px-Martin_guitar_logo.png",
  },
  {
    name: "Aria",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Aria_guitars_logo.png",
  },
  {
    name: "Charvel",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Charvel_Guitars_Logo.png",
  },
  {
    name: "Ernie Ball",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Ernie-Ball-Logo.png",
  },
  {
    name: "Nux",
    logo: "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/nux-logo-01.png",
  },
  {
    name: "Line 6",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Line_6_logo.png",
  },
  {
    name: "Ludwig",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Ludwig_logo.png",
  },
  {
    name: "Music Man",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Music-Man-logo.png",
  },
  {
    name: "Orangewood",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Orangewood_Logo_Primary_BK_1200x.png",
  },
  {
    name: "Remo",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Remo.png",
  },
  {
    name: "Rotosound",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/rotosound.png",
  },
  {
    name: "Sabian",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Sabian_cymbals_logo.svg.png",
  },
  {
    name: "Santana",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Santana.png",
  },
  {
    name: "Slash",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/slash.jpg.jpeg",
  },
  {
    name: "Sonor",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Sonor_logo.png",
  },
  {
    name: "Seymour Duncan",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/a86b256ceab02397aa5640056a2823eb.jpeg",
  },
  {
    name: "Akai",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/akai-professional-vector-logo.png",
  },
  {
    name: "Dean Markley",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/356-3566818_dean-markley-logo-png-transparent-dean-markley-logo.png",
  },
  {
    name: "Gator",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/7b56f5-Gator_Logo.png",
  },
  {
    name: "EMG",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/EMG%2C_Inc._Logo.svg.png",
  },
  {
    name: "Cort",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/New_Cort_Logo_Black.png",
  },
  {
    name: "Hohner",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/hohner-logo-png_seeklogo-353343.png",
  },
  {
    name: "Pearl",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/pearl-logo-png-transparent.png",
  },
  {
    name: "Pluto",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/pluto_logo.png",
  },
  {
    name: "Yamaha",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/png-clipart-yamaha-logo-yamaha-corporation-yamaha-pro-audio-logo-sound-yamaha-television-text.png",
  },
  {
    name: "Tama",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/tama-logo.png",
  },
  {
    name: "DAddario",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/2b5af7_a431353b93b34fd2b2357ca832aaa19c~mv2.jpg.jpeg",
  },
  {
    name: "Brand Extra",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/images%20(1).png",
  },
];

const categories = [
  {
    name: "Drums & Drums Accessories",
    image:
      "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/drum-set-dark-room-with-beautiful-lighting-snare-drum-cymbals-bass-drum%20(1).jpg",
  },
  {
    name: "Effects & Pedals",
    image:
      "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/audio_interfaces_and_mixers.jpg",
  },
  {
    name: "Accessories",
    image:
      "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/accessories.jpg.jpeg",
  },
  {
    name: "Ukuleles",
    image:
      "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/guitar-with-cap-sunglasses-shore-near-water.jpg",
  },
  {
    name: "Guitars",
    image:
      "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/WhatsApp%20Image%202026-05-18%20at%204.59.13%20PM.jpeg",
  },
  {
    name: "Piano & Keyboards",
    image:
      "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/musical-keyboard-tablet-dark-room-music-production.jpg",
  },
  {
    name: "Pro Audio & Studios",
    image:
      "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/digital-mixer-recording-studio-with-computer-recording-music-concept-creativity-show-business-space-text.jpg",
  },
  {
    name: "Amplifiers",
    image:
      "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/square-music-speaker-metallic-mesh-texture-closeup.jpg",
  },
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

  useEffect(() => {
    const handleResize = () => {
      // Desktop par aate hi mobile menu aur submenu band
      if (window.innerWidth > 768) {
        setMenuOpen(false);
        setMobileProductOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
          <a href="mailto:onstagesupport@gmail.com">info.onstageindia@gmail.com</a>
        </span>

        <span>
          <IoCallOutline />
          <a href="tel:+918447752663">+91 8447752663 </a>
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
                    className="navbar-brand-logo-btn"
                    key={brand.name}
                    onClick={() => handleBrandClick(brand.name)}
                    title={brand.name}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="navbar-brand-logo"
                    />
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
            <div className="mobile-category-grid">

              {categories.map((category, index) => (
                <button
                  type="button"
                  className="mobile-category-card"
                  key={index}
                  onClick={() => handleCategoryClick(category.name)}
                >

                  <img
                    src={category.image}
                    alt={category.name}
                    className="mobile-category-image"
                  />

                  <span className="mobile-category-overlay"></span>

                  <span className="mobile-category-name">
                    {category.name}
                  </span>

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