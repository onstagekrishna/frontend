import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setUser } from "./Redux/Slices/AuthSlice";

import ProductDetails from "./Component/ProductDetails";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import OurProductCat from "./Pages/OurProductCat";
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import AboutUs from "./Pages/AboutUs";
import CartPage from "./Pages/CartPage";
import WishlistPage from "./Pages/WishListPage";
import Home from "./Component/Home";
import ScrollToTop from "./Component/ScrollToTop";
import FilterProductByCategoryes from "./Pages/FilterProductByCategoryes";
import AddressPage from "./Pages/AddressPage";
import SearchPage from "./Pages/SearchPage";
import Profile from "./Pages/Profile";

import AccountLayout from "./Pages/Account/AccountLayout";
import MyOrders from "./Pages/Account/MyOrders";
import CustomerCare from "./Pages/Account/CustomerCare";
import Refund from "./Pages/Account/Refund";
import UpdatePassword from "./Pages/Account/UpdatePassword";
import GiftCards from "./Pages/Account/GiftCards";

import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/Dashboard";
import AdminOrders from "./Admin/Orders";
import UploadFile from "./Admin/UploadFile";
import UserQueries from "./Admin/UserQueries";
import UpdateOrders from "./Admin/UpdateOrders";
import RefundedOrder from "./Admin/RefundedOrder";

import { SearchProvider } from "./context/SearchContext";
import LoginPopup from "./Component/LoginPopup";

import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

import WhatsappChat from "./Component/WhatsappChat";

import TermsConditions from "./Pages/TermsConditions";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import RefundPolicy from "./Pages/RefundPolicy";
import BlogDetails from "./Pages/BlogDetails";
import VerifyOTP from "./Pages/VerifyOTP";

import ChangePasswordFromEmail from "./Pages/ChangePasswordFromEmail";
import LoadingIcon from "./Component/LoadingIcon";
import Contact from "./Pages/Contact";
import Faq from "./Pages/Faq";


function AppContent() {
  const productsRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const [showPopup, setShowPopup] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleProductsClick = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href =
      "https://cdn.jsdelivr.net/gh/lekoala/pop-notify/pop-notify.css";
    document.head.appendChild(cssLink);

    const iconLink = document.createElement("link");
    iconLink.rel = "stylesheet";
    iconLink.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";
    document.head.appendChild(iconLink);

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://cdn.jsdelivr.net/gh/lekoala/pop-notify@master/pop-notify.min.js";
    document.body.appendChild(script);

    script.onload = () => {
      customElements.whenDefined("pop-notify").then(() => {
        const popNotify = customElements.get("pop-notify");

        popNotify.configure({
          placement: "top-center",
          stacking: true,
          maxNotifications: 3,
          // duration: 10000,
          iconTransformer: (icon) => {
            return `<span class="material-symbols-outlined">${icon}</span>`;
          },
        });

        window.showNotification = (message, type = "success") => {

          let icon = "check_circle";

          if (type === "error") icon = "error";
          if (type === "warning") icon = "warning";
          if (type === "info") icon = "info";

          // Existing notifications
          const notifications = document.querySelectorAll("pn-notification");


          if (notifications.length >= 3) {
            notifications[0].remove();
          }

          popNotify.notify(message, {
            variant: type,
            icon,
            duration: 2000,
          });
        };
      });
    };

    return () => {
      if (document.head.contains(cssLink)) document.head.removeChild(cssLink);
      if (document.head.contains(iconLink)) document.head.removeChild(iconLink);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("https://api.onstage.co.in/api/v1/me", {
          credentials: "include",
          method: "GET",
        });

        const data = await res.json();

        if (data?.user) {
          dispatch(
            setUser({
              user: data.user,
              token: localStorage.getItem("token"),
            })
          );
        }
      } catch (err) {
        console.log("User fetch error:", err);
      }
    };

    getUser();
  }, [dispatch]);

  useEffect(() => {
    window.openLoginPopup = () => {
      if (location.pathname.startsWith("/login")) return;
      if (location.pathname.startsWith("/admin")) return;

      setShowPopup(true);
      sessionStorage.setItem("popupShown", "true");
    };
  }, [location.pathname]);

  useEffect(() => {
    setPageLoading(true);

    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const isAuthPage =
      location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname === "/verify-otp";


    if (!user && !isAuthPage && !isAdminRoute) {
      if (sessionStorage.getItem("popupShown")) return;

      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("popupShown", "true");
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, [user, location.pathname, isAdminRoute]);

  return (
    <>
      <pop-notify></pop-notify>

      {pageLoading && <LoadingIcon />}

      <ScrollToTop />

      <Header onProductsClick={handleProductsClick} />

      {showPopup && !isAdminRoute && (
        <LoginPopup onClose={() => setShowPopup(false)} />
      )}

      <Routes>
        <Route path="/" element={<Home productRef={productsRef} />} />
        <Route path="/productDetails/:product_id" element={<ProductDetails />} />
        <Route path="/ourProductPage" element={<OurProductCat />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/category" element={<FilterProductByCategoryes />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/orders" element={<AccountLayout />}>
          <Route index element={<MyOrders />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="customer-care" element={<CustomerCare />} />
          <Route path="refund" element={<Refund />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="gift-cards" element={<GiftCards />} />
        </Route>

        <Route path="/search" element={<SearchPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/contactus" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/blog-details" element={<BlogDetails />} />

        <Route path="/reset-password/:token" element={<ChangePasswordFromEmail />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="upload-file" element={<UploadFile />} />
          <Route path="user-queries" element={<UserQueries />} />
          <Route path="update-orders" element={<UpdateOrders />} />
          <Route path="refunded-order" element={<RefundedOrder />} />



        </Route>
      </Routes>

      <Footer />
      <WhatsappChat />
    </>
  );
}

function App() {
  return (
    <SearchProvider>
      <Router>
        <AppContent />
      </Router>
    </SearchProvider>
  );
}

export default App;