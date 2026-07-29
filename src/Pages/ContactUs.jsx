export default function ContactForm() {
    return (
        <>
            <div className="contact-wrapper">
                <div className="breadcrumb-section">
                    <div className="breadcrumb-overlay">
                        <h1>Contact Us</h1>
                        <p>Home / Contact Us</p>
                    </div>
                </div>

                <div className="contact-main">
                    <div className="contact-info">
                        <h2>We’d Love to Hear from You!</h2>
                        <p>
                            Reach out to us for inquiries about our musical instruments,
                            accessories, or any other questions. Our team is here to help you
                            unleash your musical potential.
                        </p>

                        <h3>Other Contact Information</h3>
                        <p><strong>Email:</strong> info@onstageindia.com</p>
                        <p><strong>Phone / WhatsApp:</strong> +91-XXXXXXXXXX</p>
                        <p><strong>Address:</strong> OnStage Music Factory, Phase 2 NSEZ, Noida, Uttar Pradesh, India</p>

                        <h3>Working Hours:</h3>
                        <p>Monday – Saturday: 10:00 AM – 7:00 PM</p>
                        <p>Sunday: Closed</p>
                    </div>

                    <div className="contact-form">
                        <h2 className="form-heading">Send Us a Message</h2>
                        <p>
                            Fill out the form below and our team will get back to you as soon as possible.
                            Whether you're looking for guidance on instruments or need support, we’re here to help!
                        </p>

                        <form>
                            <input type="text" placeholder="Name" required />
                            <input type="text" placeholder="Email / Mobile Number" required />
                            <input type="text" placeholder="Subject" required />
                            <textarea placeholder="Message" rows="5" required></textarea>
                            <button type="submit">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
