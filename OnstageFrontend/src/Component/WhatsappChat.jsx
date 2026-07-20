import { IoLogoWhatsapp } from "react-icons/io";

export default function WhatsappChat() {
    return (
        <a
            href="https://wa.me/919045452420"
            target="_blank"
            rel="noreferrer"
            className="whatsapp-chat-btn"
        >
            <IoLogoWhatsapp className="whatsapp-icon" />
            <span style={{ fontFamily: "cursive" }}>
                Chat with us
            </span>
        </a>
    );
}