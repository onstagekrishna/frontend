import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Slider() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

const slides = [
  {
    id: 1,
    Brand_Name: "Akai",
    product_id: 1129,
    desktop:
      "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/MPC%20Key%2037%20G2/MPC%20One%20Gen.jpeg",
    mobile:
      "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/MPC%20Key%2037%20G2/Mobile%20MPC%20one%20G2.jpg.jpeg",
  },
    {
    id: 2,
    Brand_Name: "Akai",
    product_id: 1130,
    desktop:
      "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/MPC%20Key%2037%20G2/WhatsApp%20Image%202026-07-02%20at%206.02.19%20PM.jpeg",
    mobile:
      "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/Mobile%20MPC%20key%2037%20g2.jpg.jpeg",
  },
    {
    id: 3,
    Brand_Name: "Numark",
    product_id: 1513,
    desktop:
      "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/numark%20party%20mix%20iii.jpg%20(1).jpeg",
    mobile:
      "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/mobile%20party%20mix%20III.jpg.jpeg",
  },
    {
    id: 4,
    Brand_Name: "Numark",
    product_id: 1512,
    desktop:
      "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/mixtrack%20go.jpg.jpeg",
    mobile:
      "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/mobile%20mixtrack%20go.jpg.jpeg",
  },
];

  // Same as old website
function handleBannerClick(productId) {
  navigate(`/productDetails/${productId}`);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

  // Auto Play
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  const nextSlide = () => {
    setActiveSlide((prev) =>
      prev < slides.length - 1 ? prev + 1 : 0
    );
  };

  const prevSlide = () => {
    setActiveSlide((prev) =>
      prev > 0 ? prev - 1 : slides.length - 1
    );
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) {
      nextSlide();
    }

    if (distance < -50) {
      prevSlide();
    }
  };

  return (
    <div className="onstage-slider-wrapper">
      <div className="onstage-slider">

        {/* Marquee */}
        <div className="slider-marquee">
          <div className="slider-marquee-track">
            <span>
              Explore Premium Musical Instruments |
              100% Genuine Products |
              Free Shipping Across India |
              Secure Checkout Experience |
              Trusted Music Store |
              Dedicated Customer Support |
              Top Global Brands Available |
              Easy Order Tracking & Updates |
            </span>

            <span>
              Explore Premium Musical Instruments |
              100% Genuine Products |
              Free Shipping Across India |
              Secure Checkout Experience |
              Trusted Music Store |
              Dedicated Customer Support |
              Top Global Brands Available |
              Easy Order Tracking & Updates |
            </span>
          </div>
        </div>

        {/* Slider */}
        <div
          className="onstage-slider-track"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(-${activeSlide * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div className="onstage-slide" key={slide.id}>
              <picture>
                {/* Only Mobile */}
                <source
                  media="(max-width:600px)"
                  srcSet={slide.mobile}
                />

                {/* Tablet + Desktop */}
                <img
                  src={slide.desktop}
                  alt={`Slide ${index + 1}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleBannerClick(slide.product_id)}
                />
              </picture>
            </div>
          ))}
        </div>

        {/* Previous */}
        <div className="onstage-slider-arrows">
          <button
            className="onstage-arrow-btn"
            onClick={prevSlide}
          >
            &#8592;
          </button>

          {/* Next */}
          <button
            className="onstage-arrow-btn"
            onClick={nextSlide}
          >
            &#8594;
          </button>
          
        </div>

        {/* Dots */}
        <div className="onstage-slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`onstage-dot ${activeSlide === index ? "active" : ""
                }`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}