import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaClock,
} from "react-icons/fa";

const Contact = () => {
    const [contactLoading, setContactLoading] = useState(false);



    const notify = (message, type = "success") => {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    };
    const getToken = () => localStorage.getItem("token");

    const authHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
    });

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.email.trim() ||
        !formData.subject.trim() ||
        !formData.message.trim()
    ) {
        notify("Please fill all fields", "error");
        return;
    }

    try {
        setContactLoading(true);

        const res = await fetch(
            "https://api.onstage.co.in/api/v1/contactus",
            {
                method: "POST",
                credentials: "include",
                headers: authHeaders(),
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                }),
            }
        );

        const data = await res.json();

        if (data.success) {
            notify(
                data.message ||
                "Thank you for contacting us. Our team will connect with you as soon as possible.",
                "success"
            );

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                subject: "",
                message: "",
            });
        } else {
            notify(data.message || "Message send failed", "error");
        }
    } catch (error) {
        console.error("Contact Us Error:", error);
        notify("Something went wrong", "error");
    } finally {
        setContactLoading(false);
    }
};

    // 👇 handleSubmit same rahega (jo tumhare code me hai)

    return (
        <div className="contact-page">

            {/* Hero */}

            <section
                className="policy-hero"
                style={{
                    backgroundImage:
                        "url('https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3.jpg.jpeg')",
                }}
            >
                <div className="policy-overlay">
                    <div className="policy-hero-content">
                        <h1>Contact Us</h1>

                        <div className="breadcrumb">
                            <Link to="/" className="breadcrumb-link">
                                Home
                            </Link>

                            <span className="divider">/</span>

                            <span className="active">Contact Us</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-section">
                <div className="contact-container">

                    <div className="contact-left">

                        <img
                            src="https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/ChatGPT%20Image%20Jul%2024%2C%202026%2C%2001_50_05%20PM.png"
                            alt="Contact"
                        />

                    </div>

                    <div className="contact-right">

                        <h2>Customer Care</h2>

                        <div className="orange-line"></div>

                        <p>
                            Have questions regarding products or dealership?
                            Fill the form and we'll get back to you.
                        </p>

                        <form onSubmit={handleSubmit}>

                            <div className="row">

                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />

                            <textarea
                                rows="4"
                                name="message"
                                placeholder="Write your message..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="submit"
                                disabled={contactLoading}
                            >
                                {contactLoading ? "Submitting..." : "Send Message"}
                            </button>

                        </form>

                    </div>
                </div>

            </section>


            <section className="contact-map">
                <div className="contact-container">

                    <iframe
                        title="OnStage Map"
                        src="https://www.google.com/maps?q=HA-101,+Hazipur,+Sector+104,+Noida,+Uttar+Pradesh+201304&output=embed"
                        loading="lazy"
                        allowFullScreen
                    />

                </div>
            </section>
        </div>
    );
};

export default Contact;