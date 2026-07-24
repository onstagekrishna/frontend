import {
  FaYoutube,
  FaDribbble,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaStore,
  FaFacebook,
} from "react-icons/fa";
import { MdCopyright } from "react-icons/md";
import { Link } from "react-router-dom";



export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-left">
          <img
            src="https://res.cloudinary.com/dfilhi9ku/image/upload/v1758099093/Onstage-Logo-2019-2_2_hdpqa0.png"
            alt="OnStage Logo"
            className="footer-logo"
          />

          <p className="footer-about">
            We offer an extensive range of musical instruments, accessories,
            and equipment from well-known brands. Whether you're a beginner
            or a seasoned professional, you’ll find the perfect instrument
            that suits your style and preferences.
          </p>
        </div>

        {/* RIGHT */}
        <div className="footer-right">

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/">Shop</Link></li>
              <li><Link to="/aboutus">About Us</Link></li>
              <li><Link to="/Contactus">Contact</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Information</h3>
            <ul>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/refund">Refund & Return Policy</Link></li>
              <li><Link to="/">Help Center</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Our Stores</h3>

            <div className="store-item">
              <div className="store-title">
                <FaStore className="store-icon" />
                <span>Store 01</span>
              </div>

              <p className="store-address">
                HA-101, 1st Floor, Hajipur
                Above Mithaas Sweets, Sector-104, Noida
              </p>
            </div>

            <div className="store-item">
              <div className="store-title">
                <FaStore className="store-icon" />
                <span>Store 02</span>
              </div>

              <p className="store-address">
                2nd Floor, Tirupati Jewellers, J-11,
                Behind McDonald's, J Block, Pocket J,
                Sector-18, Noida
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">

        {/* ✅ NEW 3D SOCIAL ICONS */}

        <div className="footer-social">

          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer"
            className="footer-social-icon"
          >
            <FaYoutube />
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="footer-social-icon"
          >
            <FaLinkedin />
          </a>

          <a
            href="https://www.instagram.com/onstageindiaofficial/"
            target="_blank"
            rel="noreferrer"
            className="footer-social-icon"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noreferrer"
            className="footer-social-icon"
          >
            <FaFacebook />
          </a>

        </div>

        <p className="copy">
          <MdCopyright /> {new Date().getFullYear()} OnStage - All Rights Reserved
        </p>
      </div>
    </footer>
  );
}