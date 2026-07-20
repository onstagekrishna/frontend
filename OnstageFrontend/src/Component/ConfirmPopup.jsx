export default function ConfirmPopup({ show, message, onConfirm, onCancel }) {

  if (!show) return null;

  return (
    <div className="popup-overlay">

      <div className="popup-box">

        <img
          src="https://pub-1cfbd62bb18344a08190c13684f63517.r2.dev/2034/logo%20(1).png"
          alt="logo"
        />

        <p>{message}</p>

        <div className="popup-buttons">
          <button className="ok-btn" onClick={onConfirm}>
            OK
          </button>

          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}