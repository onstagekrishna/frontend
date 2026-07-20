import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPopup = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ LOGIN / SIGNUP PAGE PER POPUP HIDE
  if (
    location.pathname === "/Login" ||
    location.pathname === "/Signup"
  ) {
    return null;
  }

  // 🔥 Dynamic Greeting Function
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  return (
    <div className="login-popup">
      <div className="popup-card">
        {/* ❌ CLOSE */}
        <span className="close-btn" onClick={onClose}>
          ×
        </span>

        {/* CONTENT */}
        <div className="popup-content">
          {/* 🔥 Dynamic Greeting */}
          <h2>{getGreeting()} 👋</h2>

          <h3>Welcome Back</h3>

          <p>
            Login to access your cart, wishlist & exclusive deals
          </p>

          {/* BUTTONS */}
          <button
            className="login-btn"
            onClick={() => navigate("/Login")}
          >
            Login
          </button>

          <button
            className="signup-btn"
            onClick={() => navigate("/Signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;