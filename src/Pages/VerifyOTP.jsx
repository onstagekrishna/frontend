import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/Slices/AuthSlice";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    const rawData = sessionStorage.getItem("signupData");

    if (!rawData) {
      alert("Session expired ❌ Please signup again");
      navigate("/signup");
      return;
    }

    const data = JSON.parse(rawData);

    if (!data.expiry || Date.now() > data.expiry) {
      sessionStorage.removeItem("signupData");
      alert("Session expired (10 min) ❌ Please signup again");
      navigate("/signup");
      return;
    }

    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.contactNumber ||
      !data.password ||
      !data.confirmPassword
    ) {
      alert("Signup data missing ❌");
      navigate("/signup");
      return;
    }

    if (!otp.trim() || otp.trim().length < 4) {
      alert("Enter valid OTP ❌");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://api.onstage.co.in/api/v1/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          contactNumber: data.contactNumber,
          password: data.password,
          confirmPassword: data.confirmPassword,
          role: data.role || "user",
          otp: otp.trim(),
        }),
      });

      const resData = await response.json();
      console.log("Signup Verify Response:", resData);

      if (!response.ok || !resData.success) {
        alert(resData.message || "Invalid OTP ❌");
        return;
      }

      dispatch(
        setUser({
          user: resData.data,
          token: resData.token,
        })
      );

      sessionStorage.removeItem("signupData");

      alert("Account created & logged in ✅");
      navigate("/", { replace: true });
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
        <h2 style={{ color: "#fff" }}>Enter OTP</h2>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            maxLength="6"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />

          <button type="submit" className="custom-signup-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;