import { useState } from "react";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("Reset link has been sent to your email.");
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
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a reset link</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Send Reset Link</button>
        </form>

        {msg && <p className="fp-success-msg">{msg}</p>}
      </div>
    </div>
  );
}