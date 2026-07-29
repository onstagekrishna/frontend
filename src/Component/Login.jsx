import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/Slices/AuthSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      window.showNotification
        ? window.showNotification("Please fill all fields", "error")
        : alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://api.onstage.co.in/api/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("FULL LOGIN RESPONSE:", data);

      if (!response.ok || !(data.success || data.sucess)) {
        window.showNotification
          ? window.showNotification(
              data.message || "Email or password is wrong",
              "error"
            )
          : alert(data.message || "Email or password is wrong");
        return;
      }

      const loggedInUser = data.user || data.checkUserPresent;

      if (!loggedInUser) {
        window.showNotification
          ? window.showNotification("User data missing", "error")
          : alert("User data missing");
        return;
      }

      // Token find from all possible keys
      const token =
        data.token ||
        data.accessToken ||
        data.access_token ||
        data.jwt ||
        loggedInUser.token ||
        null;

      console.log("TOKEN FOUND:", token);

      dispatch(
        setUser({
          user: loggedInUser,
          token,
        })
      );

      if (token) {
        localStorage.setItem("token", token);
      }

      localStorage.setItem("user", JSON.stringify(loggedInUser));

      console.log(
        "TOKEN SAVED IN LOCALSTORAGE:",
        localStorage.getItem("token")
      );

      window.showNotification
        ? window.showNotification("Login successful", "success")
        : alert("Login successful");

      const role = loggedInUser?.role?.toLowerCase();

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      window.showNotification
        ? window.showNotification("Network error", "error")
        : alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-login-container">
      <video autoPlay muted loop playsInline className="background-video">
        <source
          src="https://pub-7a873ed9b69643f2a2859ab739e09ae3.r2.dev/45450-443133809_medium.mp4"
          type="video/mp4"
        />
      </video>

      <div className="custom-login-form">
        <img
          src="https://res.cloudinary.com/dfilhi9ku/image/upload/v1758112097/Onstage-Logo-2019-2_2_pvggfn.png"
          alt="Logo"
          className="custom-login-logo"
        />

        <form onSubmit={handleLogin}>
          <div className="custom-login-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="custom-login-field password-field">
            <label>Password</label>

            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="forgot-password-wrapper">
            <span
              className="forgot-password-text"
              onClick={() => navigate("/forgot-password")}
            >
              Reset Password?
            </span>
          </div>

          <button
            type="submit"
            className="custom-login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="signup-link"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}