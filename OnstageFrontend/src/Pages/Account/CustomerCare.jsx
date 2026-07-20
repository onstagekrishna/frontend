import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerCare() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  const notify = (message, type = "success") => {
    if (window.showNotification) {
      window.showNotification(message, type);
    } else {
      alert(message);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !contactMessage.trim()
    ) {
      notify("Please fill all fields", "error");
      return;
    }

    try {
      setContactLoading(true);

      const res = await fetch("https://api.onstage.co.in/api/v1/contactus", {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          subject,
          message: contactMessage,
        }),
      });

      const data = await res.json();

      if (data.success) {
        notify(
          data.message ||
            "Thank for contact us our team will connect you as soon as possible",
          "success"
        );

        setFirstName("");
        setLastName("");
        setEmail("");
        setSubject("");
        setContactMessage("");
      } else {
        notify(data.message || "Message send failed", "error");
      }
    } catch (error) {
      console.log("Contact Us Error:", error);
      notify("Something went wrong", "error");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <>
      <div className="account-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <span> / </span>
        <span className="active">Customer Care</span>
      </div>

      <div className="account-care-box">
        <div className="account-care-image">
          <img
            src="https://pub-0615ebb6fedb4102ac96a53079def168.r2.dev/people-working-call-center.jpg"
            alt="Customer Care"
          />
        </div>

        <div className="account-care-form">
          <h2>Customer Care</h2>

          <form className="customer-care-form" onSubmit={handleContactSubmit}>
            <div className="customer-care-row">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <textarea
              maxLength={1000}
              placeholder="Message..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
            />

            <button type="submit" disabled={contactLoading}>
              {contactLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}