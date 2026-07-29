import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function Slider() {
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      product_id: 1129,
      desktop:
        "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/MPC%20Key%2037%20G2/MPC%20One%20Gen.jpeg",
      mobile:
        "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/MPC%20Key%2037%20G2/Mobile%20MPC%20one%20G2.jpg.jpeg",
    },
    {
      id: 2,
      product_id: 1130,
      desktop:
        "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/MPC%20Key%2037%20G2/WhatsApp%20Image%202026-07-02%20at%206.02.19%20PM.jpeg",
      mobile:
        "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/Mobile%20MPC%20key%2037%20g2.jpg.jpeg",
    },
    {
      id: 3,
      product_id: 1513,
      desktop:
        "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/numark%20party%20mix%20iii.jpg%20(1).jpeg",
      mobile:
        "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/mobile%20party%20mix%20III.jpg.jpeg",
    },
    {
      id: 4,
      product_id: 1512,
      desktop:
        "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/mixtrack%20go.jpg.jpeg",
      mobile:
        "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/mobile%20mixtrack%20go.jpg.jpeg",
    },
  ];

  const autoplay = Autoplay({
    delay: 5000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: false,
      skipSnaps: false,
    },
    [autoplay]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const handleBannerClick = (id) => {
    navigate(`/productDetails/${id}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="onstage-slider-wrapper">

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
          </span>

          <span>
            Explore Premium Musical Instruments |
            100% Genuine Products |
            Free Shipping Across India |
            Secure Checkout Experience |
            Trusted Music Store |
            Dedicated Customer Support |
            Top Global Brands Available |
          </span>
        </div>
      </div>

      <div className="onstage-slider">

        <div className="embla" ref={emblaRef}>

          <div className="embla__container">

            {slides.map((slide, index) => (

              <div className="embla__slide" key={slide.id}>

                <picture>

                  <source
                    media="(max-width:767px)"
                    srcSet={slide.mobile}
                  />

                  <img
                    src={slide.desktop}
                    alt={`Banner ${index + 1}`}
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleBannerClick(slide.product_id)}
                  />

                </picture>

              </div>

            ))}

          </div>

        </div>

        <button
          className="onstage-arrow-btn left"
          onClick={scrollPrev}
        >
          &#10094;
        </button>

        <button
          className="onstage-arrow-btn right"
          onClick={scrollNext}
        >
          &#10095;
        </button>

        <div className="onstage-slider-dots">

          {slides.map((_, index) => (

            <button
              key={index}
              className={`onstage-dot ${selectedIndex === index ? "active" : ""
                }`}
              onClick={() => emblaApi?.scrollTo(index)}
            />

          ))}

        </div>

      </div>

    </div>
  );
}