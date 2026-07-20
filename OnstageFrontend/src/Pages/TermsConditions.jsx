import { Link } from "react-router-dom";

export default function TermsConditions() {
  return (
    <div className="policy-page">

      {/* Hero Banner */}
      <section
        className="policy-hero"
        style={{
          backgroundImage:
            "url('https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3.jpg.jpeg')",
        }}
      >
        <div className="policy-overlay">
          <div className="policy-hero-content">
            <h1>Terms & Conditions</h1>

            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                Home
              </Link>

              <span className="divider">/</span>

              <span className="active">Terms & Conditions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="policy-content">

        <p className="policy-intro">
          Welcome to <strong>OnStage Music Factory</strong>. By accessing or
          using our website, you agree to comply with these Terms &
          Conditions. Please read them carefully before using our website
          or purchasing any products.
        </p>

        <div className="policy-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By visiting our website, creating an account, or placing an
            order, you agree to these Terms & Conditions. If you do not
            agree, please discontinue using our services.
          </p>
        </div>

        <div className="policy-section">
          <h2>2. Products & Availability</h2>
          <p>
            Product descriptions, pricing, availability, and specifications
            may change without prior notice. We strive to keep all
            information accurate and up to date.
          </p>
        </div>

        <div className="policy-section">
          <h2>3. Orders & Payments</h2>
          <p>
            Orders are confirmed only after successful payment verification.
            We reserve the right to cancel orders in case of pricing errors,
            stock issues, or suspected fraudulent activity.
          </p>
        </div>

        <div className="policy-section">
          <h2>4. Shipping & Delivery</h2>
          <p>
            Estimated delivery times may vary depending on your location,
            courier services, weather conditions, or other unforeseen
            circumstances.
          </p>
        </div>

        <div className="policy-section">
          <h2>5. Returns & Refunds</h2>
          <p>
            Please refer to our Refund & Return Policy for complete details
            regarding product returns, exchanges, and refunds.
          </p>
        </div>

        <div className="policy-section">
          <h2>6. User Responsibilities</h2>
          <p>
            Users must provide accurate information and must not misuse the
            website or engage in unlawful or fraudulent activities.
          </p>
        </div>

        <div className="policy-section">
          <h2>7. Intellectual Property</h2>
          <p>
            All website content including text, logos, graphics, images and
            designs are the property of OnStage Music Factory and may not be
            copied or reproduced without written permission.
          </p>
        </div>

        <div className="policy-section">
          <h2>8. Limitation of Liability</h2>
          <p>
            We are not liable for indirect, incidental, or consequential
            damages arising from the use of our website, products, or
            services.
          </p>
        </div>

        <div className="policy-section">
          <h2>9. Changes to Terms</h2>
          <p>
            These Terms & Conditions may be updated at any time without
            prior notice. Continued use of the website constitutes
            acceptance of the revised terms.
          </p>
        </div>

        <div className="policy-section">
          <h2>10. Contact Us</h2>
          <p>
            For any questions regarding these Terms & Conditions, please
            contact our customer support team through our Contact Us page.
          </p>
        </div>

      </div>
    </div>
  );
}