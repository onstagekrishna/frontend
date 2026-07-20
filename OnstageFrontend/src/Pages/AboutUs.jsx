import { useEffect, useState } from "react";

export default function AboutUs() {
  const statsData = [
    { value: 250, label: "Artists Distributed" },
    { value: 1200, label: "Instruments Delivered" },
    { value: 85, label: "Studio Partners" },
    { value: 40, label: "Global Brands" },
  ];

  // Counter hook
  const Counter = ({ end, duration }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const increment = end / (duration / 10);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(Math.floor(start));
        }
      }, 10);

      return () => clearInterval(timer);
    }, [end, duration]);

    return <>{count.toLocaleString()}</>;
  };

  return (
    <div className="about-container">
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="breadcrumb-overlay">
          <h1>About Us</h1>
          <p>Home / About Us</p>
        </div>
      </div>

      {/* Counter Section */}


      {/* Top Section */}
      <div className="about-top">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            At OnStage Music Factory, music is more than just sound — it
            is passion, creativity, and expression. Since our inception, we have
            been committed to delivering world-class musical instruments and
            professional audio equipment to artists, studios, and music
            enthusiasts across the region. Our mission is simple: to make
            high-quality sound accessible for everyone, from beginners to
            seasoned professionals.
          </p>
          <p>
            We take pride in being a trusted distributor of leading brands,
            offering a wide range of instruments and equipment designed to meet
            the needs of every musician. Whether you are setting up your first
            home studio, performing live on stage, or producing music
            professionally, Onstage ensures that you have the right tools to
            bring your sound to life.
          </p>
          <p>
            At Onstage Distributor Company, we take pride in offering a complete
            selection of instruments and equipment that meet the needs of every
            musician. Our acoustic drums and electronic drum kits deliver
            everything from traditional rhythms to modern digital precision,
            giving drummers flexibility on stage and in the studio. To ensure
            every note is heard with clarity, our studio monitors and mixers
            provide professional-grade sound for producers, engineers, and
            performers alike.
          </p>
        </div>
        <div className="about-image">
          <img
            src="https://res.cloudinary.com/dfilhi9ku/image/upload/v1758528307/Gemini_Generated_Image_1zdpvs1zdpvs1zdp_t8dt0s.png"
            alt="About Us"
          />
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="about-boxes">
        <div className="about-box mission">
          <h3>Our Mission</h3>
          <p>
            To deliver top-quality services with integrity, innovation, and a
            customer-first approach.
          </p>
        </div>
        <div className="about-box vision">
          <h3>Our Vision</h3>
          <p>
            To be recognized as a leader in our industry by creating value and
            making a positive impact.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="about-why">
        <h2>Why Choose Us</h2>
        <div className="why-box">
          <ul>
            <li>✔ Experienced Team</li>
            <li>✔ Customer-Centric Approach</li>
            <li>✔ Innovative Solutions</li>
            <li>✔ Reliable & Trusted Services</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
