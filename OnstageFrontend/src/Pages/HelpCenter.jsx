import React from "react";

const HelpCenter = () => {
  const banner =
    "https://pub-1cfbd62bb18344a08190c13684f63517.r2.dev/274/banner-Privacy-Policy-1%20(1).jpg";

  return (
    <div className="help-page">
      <div className="help-banner">
        <img src={banner} alt="banner" />
      </div>

      <div className="help-container">
        <h1>Help Center</h1>
        <p>We are here to help you.</p>

        <h3>Support</h3>
        <p>Contact us anytime.</p>

        <h3>FAQs</h3>
        <p>Check frequently asked questions.</p>

        <h3>Contact</h3>
        <p>Email: support@example.com</p>
      </div>
    </div>
  );
};

export default HelpCenter;