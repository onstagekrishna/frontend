import React from "react";
import { useNavigate } from "react-router-dom";

const brandCards = [
  {
    name: "Cordoba",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/0_Logo_Cordoba_Blue%2BCordoba%2Bwith%2BArches-large.png",
    desc: "Classical Guitar Brand",
  },
  {
    name: "Fender",
    logo: "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/fender_logo.svg",
    desc: "Electric Guitar Brand",
  },
  {
    name: "Jackson",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/1280px-Jackson_guitars_logo.svg.png",
    desc: "Metal Guitar Brand",
  },
  {
    name: "Shure",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/1280px-Shure_Logo.svg.png",
    desc: "Audio Equipment Brand",
  },
  {
    name: "Alesis",
    logo: "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/images.png",
    desc: "Electronic Drum Brand",
  },
  {
    name: "Schecter",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/296-2962465_schecter-guitar-reasearch-schecter-guitar-research-logo.png",
    desc: "Performance Guitar Brand",
  },
  {
    name: "MUSEDO",
    logo: "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/Logo-brand-Musedo.jpg",
    desc: "Music Accessories Brand",
  },
  {
    name: "Martin",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/800px-Martin_guitar_logo.png",
    desc: "Acoustic Guitar Brand",
  },
  {
    name: "Aria",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Aria_guitars_logo.png",
    desc: "Guitar Instrument Brand",
  },
  {
    name: "Charvel",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Charvel_Guitars_Logo.png",
    desc: "Rock Guitar Brand",
  },
  {
    name: "Ernie Ball",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Ernie-Ball-Logo.png",
    desc: "Guitar Strings Brand",
  },
  {
    name: "Nux",
    logo: "https://pub-d5d786d675024a039884449faea17b9e.r2.dev/nux-logo-01.png",
    desc: "Guitar Effects Brand",
  },
  {
    name: "Line 6",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Line_6_logo.png",
    desc: "Effects Processor Brand",
  },
  {
    name: "Ludwig",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Ludwig_logo.png",
    desc: "Drum Kit Brand",
  },
  {
    name: "Music Man",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Music-Man-logo.png",
    desc: "Bass Guitar Brand",
  },
  {
    name: "Orangewood",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Orangewood_Logo_Primary_BK_1200x.png",
    desc: "Acoustic Guitar Brand",
  },
  {
    name: "Remo",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Remo.png",
    desc: "Drum Heads Brand",
  },
  {
    name: "Rotosound",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/rotosound.png",
    desc: "Strings Accessories Brand",
  },
  {
    name: "Sabian",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Sabian_cymbals_logo.svg.png",
    desc: "Cymbals Audio Brand",
  },
  {
    name: "Santana",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Santana.png",
    desc: "Signature Guitar Brand",
  },
  {
    name: "Slash",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/slash.jpg.jpeg",
    desc: "Artist Guitar Brand",
  },
  {
    name: "Sonor",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/Sonor_logo.png",
    desc: "Percussion Instruments Brand",
  },
  {
    name: "Seymour Duncan",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/a86b256ceab02397aa5640056a2823eb.jpeg",
    desc: "Premium Audio Brand",
  },
  {
    name: "Akai",
    logo: "https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/akai-professional-vector-logo.png",
    desc: "Music Production Brand",
  },

  {
    name: "Dean Markley",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/356-3566818_dean-markley-logo-png-transparent-dean-markley-logo.png",
    desc: "Strings Brand",
  },
  {
    name: "Gator",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/7b56f5-Gator_Logo.png",
    desc: "Cases Brand",
  },
  {
    name: "EMG",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/EMG%2C_Inc._Logo.svg.png",
    desc: "Pickup Brand",
  },
  {
    name: "Cort",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/New_Cort_Logo_Black.png",
    desc: "Guitar Brand",
  },
  {
    name: "Hohner",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/hohner-logo-png_seeklogo-353343.png",
    desc: "Harmonica Brand",
  },
  {
    name: "Pearl",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/pearl-logo-png-transparent.png",
    desc: "Drums Brand",
  },
  {
    name: "Pluto",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/pluto_logo.png",
    desc: "Guitar Brand",
  },
  {
    name: "Yamaha",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/png-clipart-yamaha-logo-yamaha-corporation-yamaha-pro-audio-logo-sound-yamaha-television-text.png",
    desc: "Musical Instruments Brand",
  },
  {
    name: "Tama",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/tama-logo.png",
    desc: "Drums Brand",
  },
  {
    name: "DAddario",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/2b5af7_a431353b93b34fd2b2357ca832aaa19c~mv2.jpg.jpeg",
    desc: "Strings Brand",
  },
  {
    name: "Brand Extra",
    logo: "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/3rd%20brand/images%20(1).png",
    desc: "Music Brand",
  },

];

function BrandLogo() {
  const navigate = useNavigate();

  const handleBrandClick = (brandName) => {
    navigate(`/category?brand=${encodeURIComponent(brandName)}&page=1`);
  };

  return (
    <section className="os-brand-section">
      <div className="container">
        <div className="os-brand-container">
          <div className="brand-heading-wrapper">
            <h2 className="brand-heading">OUR BRANDS</h2>
            <p className="brand-tagline">
              Discover trusted brands known for quality, innovation, and performance.
            </p>
          </div>

          <div className="os-brand-grid">
            {brandCards.map((brand, index) => (
              <div
                className="os-brand-card"
                key={index}
                onClick={() => handleBrandClick(brand.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleBrandClick(brand.name);
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="os-brand-logo">
                  <img src={brand.logo} alt={brand.name} />
                </div>

                <span className="os-brand-small-line"></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandLogo;