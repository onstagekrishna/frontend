import { Link } from "react-router-dom";
import { useState } from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "How can I place an order?",
      answer:
        "Browse our products, add your desired items to the cart, proceed to checkout, and complete your payment securely. Once your order is confirmed, you will receive an order confirmation email.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept secure online payments through Credit Cards, Debit Cards, UPI, Net Banking, and other supported payment gateways.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery timelines depend on your location. Most orders are delivered within 3–7 business days after dispatch.",
    },
    {
      question: "Can I return or exchange my order?",
      answer:
        "Yes. Eligible products can be returned or exchanged according to our Refund & Return Policy. Please ensure the product is unused and in its original packaging.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you will receive a tracking ID via email or SMS that can be used to track your shipment.",
    },
    {
      question: "Do your products come with a warranty?",
      answer:
        "Warranty availability depends on the product and manufacturer. Please check the product description for warranty details.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Orders can be cancelled only before they are shipped. Once dispatched, cancellation is not possible.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach our customer support team through our Contact Us page, email, or phone during business hours.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

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
            <h1>Frequently Asked Questions</h1>

            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                Home
              </Link>

              <span className="divider">/</span>

              <span className="active">FAQs</span>
            </div>
          </div>
        </div>
      </section>

      <div className="policy-content">
        <p className="policy-intro">
          Welcome to the <strong>OnStage Music Factory</strong> FAQ section.
          Here you'll find answers to the most commonly asked questions about
          orders, payments, shipping, returns, and customer support.
        </p>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${openIndex === index ? "active" : ""}`}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span>{faq.question}</span>
                <span>{openIndex === index ? "−" : "+"}</span>
              </button>

              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}