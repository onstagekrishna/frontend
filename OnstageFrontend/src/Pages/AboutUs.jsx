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

      <div className="about-top">

        {/* Left */}
        <div className="about-content">

          <h2>About OnStage Music Factory</h2>

          <p>
            At OnStage Music Factory, music is more than just sound — it is
            passion, creativity, and expression. Since our inception, we have
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
            professionally, OnStage ensures that you have the right tools to
            bring your sound to life.
          </p>

                  <p>
          At OnStage Distributor Company, we take pride in offering a complete
          selection of instruments and equipment that meet the needs of every
          musician. Our acoustic drums and electronic drum kits deliver
          everything from traditional rhythms to modern digital precision,
          giving drummers flexibility on stage and in the studio. To ensure
          every note is heard with clarity, our studio monitors, mixers,
          microphones and professional audio systems help creators produce
          exceptional sound with confidence.
        </p>

        </div>

        {/* Right */}
        <div className="about-image">

          <img
            src="https://pub-545cabf104d34f849ccb8626338c8a89.r2.dev/ChatGPT%20Image%20Jul%2024%2C%202026%2C%2001_50_05%20PM.png"
            alt="OnStage Music Factory"
          />

        </div>

      </div>


      {/* Mission Vision */}

      <div className="about-boxes">

        <div className="about-box mission">

          <h3>Our Mission</h3>

          <p>
            To empower every musician with world-class musical instruments,
            innovative audio solutions and exceptional customer service while
            making premium music equipment accessible across India.
          </p>

        </div>

        <div className="about-box vision">

          <h3>Our Vision</h3>

          <p>
            To become India's most trusted destination for musical
            instruments, professional audio equipment and creative innovation,
            inspiring every artist to perform with confidence.
          </p>

        </div>

      </div>

      {/* Why Choose */}

      <div className="about-why">

        <h2>Why Choose OnStage Music Factory</h2>

        <div className="why-grid">

          <div className="why-card">
            <h3>Premium Global Brands</h3>
            <p>Discover internationally trusted musical instrument brands.</p>
          </div>

          <div className="why-card">
            <h3>100% Genuine Products</h3>
            <p>Every product is sourced directly from authorized distributors.</p>
          </div>

          <div className="why-card">
            <h3>Fast Delivery</h3>
            <p>Safe and quick shipping across India.</p>
          </div>

          <div className="why-card">
            <h3>Expert Support</h3>
            <p>Our team helps you choose the perfect instrument.</p>
          </div>

          <div className="why-card">
            <h3>Studio & Live Solutions</h3>
            <p>Everything from home studios to live performance setups.</p>
          </div>

          <div className="why-card">
            <h3>After Sales Service</h3>
            <p>Reliable assistance even after your purchase.</p>
          </div>

        </div>

      </div>
      {/* Top Section */}


    </div>
  );
}