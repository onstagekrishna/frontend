import { useEffect } from "react";

export default function Toast({ message, show, setShow }) {

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="toast">

      <div className="toast-content">

        <img
          className="toast-icon"
          src="https://pub-1cfbd62bb18344a08190c13684f63517.r2.dev/2034/logo%20(1).png"
          alt="logo"
        />

        <span className="toast-message">
          {message}
        </span>

      </div>

      <button
        className="toast-close"
        onClick={() => setShow(false)}
      >
        ✕
      </button>

    </div>
  );
}