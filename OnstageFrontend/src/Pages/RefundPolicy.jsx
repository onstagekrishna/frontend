import { Link } from "react-router-dom";

export default function RefundPolicy() {
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
            <h1>Refund & Return Policy</h1>

            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                Home
              </Link>

              <span className="divider">/</span>

              <span className="active">Refund & Return Policy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="policy-content">
        <p className="policy-intro">
          At <strong>OnStage Music Factory</strong>, customer satisfaction is
          our highest priority. We strive to provide high-quality musical
          instruments and accessories. If you are not completely satisfied with
          your purchase, please review our Refund & Return Policy to understand
          the eligibility, process, and conditions for returns, replacements,
          and refunds.
        </p>

        <div className="policy-section">
          <h2>1. Return Eligibility</h2>
          <p>
            Products may be returned within <strong>7 days</strong> of delivery,
            provided they are unused, in their original packaging, and include
            all accessories, manuals, tags, and proof of purchase.
          </p>
        </div>

        <div className="policy-section">
          <h2>2. Non-Returnable Products</h2>
          <p>
            Customized products, special-order items, gift cards, downloadable
            products, and products showing signs of misuse, physical damage, or
            missing accessories are not eligible for return unless they were
            delivered in a defective or incorrect condition.
          </p>
        </div>

        <div className="policy-section">
          <h2>3. Damaged or Incorrect Deliveries</h2>
          <p>
            If you receive a damaged, defective, or incorrect item, please
            notify our customer support within <strong>48 hours</strong> of
            delivery. Kindly provide clear images or videos of the product and
            packaging to help us process your request quickly.
          </p>
        </div>

        <div className="policy-section">
          <h2>4. Refund Process</h2>
          <p>
            Once the returned product has been received and successfully
            inspected, approved refunds will be initiated to your original
            payment method. Refunds are generally completed within
            <strong> 5–7 business days</strong>, depending on your payment
            provider or bank.
          </p>
        </div>

        <div className="policy-section">
          <h2>5. Exchange Policy</h2>
          <p>
            Product exchanges are available only for items that are damaged,
            defective, or incorrectly delivered. Replacement is subject to
            product availability at the time of processing.
          </p>
        </div>

        <div className="policy-section">
          <h2>6. Order Cancellation</h2>
          <p>
            Orders can be cancelled only before they have been shipped. Once an
            order has been dispatched, cancellation requests cannot be accepted.
            Customers may still request a return if the product qualifies under
            our return policy.
          </p>
        </div>

        <div className="policy-section">
          <h2>7. Shipping Charges</h2>
          <p>
            Shipping charges are generally non-refundable unless the return is
            due to an incorrect shipment, damaged product, or an error on our
            part.
          </p>
        </div>

        <div className="policy-section">
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions regarding returns, exchanges, or refunds,
            please contact the OnStage Music Factory customer support team
            through our official Contact Us page. We will be happy to assist
            you.
          </p>
        </div>
      </div>
    </div>
  );
}