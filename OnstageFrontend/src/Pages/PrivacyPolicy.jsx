import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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
            <h1>Privacy Policy</h1>

            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                Home
              </Link>

              <span className="divider">/</span>

              <span className="active">Privacy Policy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="policy-content">
        <p className="policy-intro">
          At <strong>OnStage Music Factory</strong>, your privacy is our
          priority. We are committed to protecting your personal information
          and ensuring a safe, secure, and transparent shopping experience.
          This Privacy Policy explains how we collect, use, store, and
          safeguard your information when you visit our website, create an
          account, place an order, or interact with our services.
        </p>

        <div className="policy-section">
          <h2>1. Information We Collect</h2>
          <p>
            We may collect your name, email address, phone number, shipping
            address, billing details, order information, and other details
            necessary to provide our services. We may also collect technical
            information such as your browser type, IP address, and device
            information to improve website performance and security.
          </p>
        </div>

        <div className="policy-section">
          <h2>2. How We Use Your Information</h2>
          <p>
            Your information is used to process orders, manage your account,
            provide customer support, improve our products and services, send
            order updates, and communicate promotional offers when permitted.
            We only use your information for legitimate business purposes.
          </p>
        </div>

        <div className="policy-section">
          <h2>3. Payment Security</h2>
          <p>
            We do not store your complete debit or credit card details on our
            servers. All payments are securely processed through trusted
            payment gateway providers using industry-standard encryption and
            security protocols.
          </p>
        </div>

        <div className="policy-section">
          <h2>4. Data Protection</h2>
          <p>
            We use appropriate administrative, technical, and physical
            safeguards to protect your personal information from unauthorized
            access, disclosure, alteration, or misuse.
          </p>
        </div>

        <div className="policy-section">
          <h2>5. Cookies</h2>
          <p>
            Our website uses cookies to remember your preferences, improve site
            functionality, analyze visitor behavior, and provide a better user
            experience. You may disable cookies through your browser settings
            if you choose.
          </p>
        </div>

        <div className="policy-section">
          <h2>6. Third-Party Services</h2>
          <p>
            We may share limited information with trusted third-party service
            providers such as payment gateways, courier partners, analytics
            providers, and customer support platforms strictly for providing
            our services efficiently and securely.
          </p>
        </div>

        <div className="policy-section">
          <h2>7. Your Rights</h2>
          <p>
            You have the right to access, update, correct, or request deletion
            of your personal information, subject to applicable legal
            requirements. You may also opt out of promotional emails at any
            time.
          </p>
        </div>

        <div className="policy-section">
          <h2>8. Policy Updates</h2>
          <p>
            We may revise this Privacy Policy from time to time to reflect
            changes in legal requirements or our business practices. Updated
            versions will be published on this page and become effective
            immediately.
          </p>
        </div>

        <div className="policy-section">
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy or how your
            personal information is handled, please contact the OnStage Music
            Factory customer support team through our official Contact Us page.
          </p>
        </div>
      </div>
    </div>
  );
}