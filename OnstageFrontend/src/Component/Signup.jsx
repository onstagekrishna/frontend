import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !contactNumber.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://api.onstage.co.in/api/v1/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();
      console.log("OTP Response:", data);

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to send OTP ❌");
        return;
      }

      sessionStorage.setItem(
        "signupData",
        JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          contactNumber: contactNumber.trim(),
          password,
          confirmPassword,
          role: "user",
          expiry: Date.now() + 10 * 60 * 1000,
        })
      );

      alert("OTP sent successfully ✅");
      navigate("/verify-otp");
    } catch (err) {
      console.log(err);
      alert("Network error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-signup-container">
      <video autoPlay muted loop playsInline className="background-video">
        <source
          src="https://pub-7a873ed9b69643f2a2859ab739e09ae3.r2.dev/45450-443133809_medium.mp4"
          type="video/mp4"
        />
      </video>

      <div className="custom-signup-form">
        <img
          src="https://res.cloudinary.com/dfilhi9ku/image/upload/v1758112097/Onstage-Logo-2019-2_2_pvggfn.png"
          alt="Logo"
          className="custom-signup-logo"
        />

        <form onSubmit={handleSignup}>
          <div className="custom-signup-row">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Mobile Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button type="submit" className="custom-signup-btn" disabled={loading}>
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>

          <p className="custom-signup-footer">
            Already have an account?{" "}
            <span className="login-link" onClick={() => navigate("/login")}>
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}