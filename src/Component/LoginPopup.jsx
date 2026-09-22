import React, { useEffect } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const LoginPopup = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath =
    location.pathname.toLowerCase();

  const isAuthPage =
    currentPath === "/login" ||
    currentPath === "/signup" ||
    currentPath === "/verify-otp";

  useEffect(() => {
    if (isAuthPage) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isAuthPage]);

  if (isAuthPage) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning!";
    }

    if (hour < 17) {
      return "Good Afternoon!";
    }

    if (hour < 21) {
      return "Good Evening!";
    }

    return "Good Night!";
  };

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleSignup = () => {
    onClose();
    navigate("/signup");
  };

  return (
    <div
      className="login-popup"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="popup-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="popup-image">
          <img
            src="https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/login%20finl%202.jpg"
            alt="Onstage Login"
          />
        </div>

        <div className="popup-content">
          <div className="popup-inner">
            <img
              src="https://www.onstageindia.in/assets/logo--YQ-9eqE.png"
              alt="Onstage"
              className="popup-logo"
            />

            <h2>
              {getGreeting()}
            </h2>

            <p className="popup-description">
              Login to access your cart,
              wishlist
              <br />
              & exclusive deals
            </p>

            <button
              type="button"
              className="login-btn"
              onClick={handleLogin}
            >
              Login
            </button>

            <button
              type="button"
              className="signup-btn"
              onClick={handleSignup}
            >
              Sign Up
            </button>

            <p className="popup-footer">
              Welcome to the Onstage family
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;

