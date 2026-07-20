import "./style.css";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Drums & Drums Accessories", image: "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/drum-set-dark-room-with-beautiful-lighting-snare-drum-cymbals-bass-drum%20(1).jpg" },
  { name: "Effects & Pedals", image: "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/audio_interfaces_and_mixers.jpg" },
  { name: "Accessories", image: "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/accessories.jpg.jpeg" },
  { name: "Ukuleles", image: "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/guitar-with-cap-sunglasses-shore-near-water.jpg" },
  { name: "Guitars", image: "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/WhatsApp%20Image%202026-05-18%20at%204.59.13%20PM.jpeg" },
  { name: "Piano & Keyboards", image: "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/musical-keyboard-tablet-dark-room-music-production.jpg" },
  { name: "Pro Audio & Studio", image: "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/digital-mixer-recording-studio-with-computer-recording-music-concept-creativity-show-business-space-text.jpg" },
  { name: "Amplifiers", image: "https://pub-2495b31388a64466968bc41b633cc28a.r2.dev/square-music-speaker-metallic-mesh-texture-closeup.jpg" },
];

export default function OurCategories() {
  const navigate = useNavigate();

  const handleClick = (categoryName) => {
    navigate(`/category?type=${encodeURIComponent(categoryName)}&page=1`);
    console.log(categoryName)
  };

  return (
    <section className="category-section">
      <div className="container">
      <div className="category-heading-wrapper">
        <h2 className="category-heading">OUR CATEGORIES</h2>
        <p className="category-tagline">
          Explore the world of live performances, events, and unforgettable moments.
        </p>
      </div>

      <div className="category-container">
        {categories.map((item, index) => (
          <div
            key={index}
            className={`category-card card-${index}`}
            onClick={() => handleClick(item.name)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              onLoad={(e) => e.target.classList.add("loaded")}
            />
            <div className="overlay">
              <h3>{item.name}</h3>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}