import { useState } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 👉 API baad me connect hogi
    setMsg("Password has been reset successfully (demo)");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p>Enter your new password</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Reset Password</button>
        </form>

        {msg && <p className="success-msg">{msg}</p>}
      </div>
    </div>
  );
}