import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ChangePasswordFromEmail() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setMsg("Passwords do not match");
    }

    if (password.length < 6) {
      return setMsg("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      // Backend API call yahan lagegi
      console.log("TOKEN:", token);
      console.log("NEW PASSWORD:", password);

      // Example:
      /*
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          token,
          password,
        }
      );

      setMsg(response.data.message);
      */

      setMsg("Password changed successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      <video autoPlay muted loop playsInline className="fp-bg-video">
        <source
          src="https://pub-7a873ed9b69643f2a2859ab739e09ae3.r2.dev/45450-443133809_medium.mp4"
          type="video/mp4"
        />
      </video>

      <div className="fp-card">
        <h2>Set New Password</h2>

        <p>
          Enter your new password below to regain access to your account.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {msg && <p className="fp-success-msg">{msg}</p>}
      </div>
    </div>
  );
}