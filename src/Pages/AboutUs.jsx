import { useEffect, useState } from "react";


const stores = [
  {
    name: "Sector 18",
    image:
      "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/store%20image/18-1.jpeg",
  },
  {
    name: "Sector 104",
    image:
      "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/store%20image/104-1.jpeg",
  },
  {
    name: "Lajpat Nagar",
    image:
      "https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/store%20image/lajpat%20(2).jpeg",
  },
];

const statsData = [
  {
    value: 250,
    label: "Artists Distributed",
  },
  {
    value: 1200,
    label: "Instruments Delivered",
  },
  {
    value: 85,
    label: "Studio Partners",
  },
  {
    value: 40,
    label: "Global Brands",
  },
];

function Counter({ end, duration = 1800 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const totalSteps = Math.max(Math.floor(duration / 10), 1);
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 10);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function AboutUs() {
  return (
    <main className="about-container">

      {/* ================= BREADCRUMB ================= */}
      <section className="breadcrumb-section">
        <div className="breadcrumb-overlay">
          <h1>About Us</h1>
          <p>Home / About Us</p>
        </div>
      </section>

      {/* ================= ABOUT STORY ================= */}
      <section className="about-story">
        <div className="story-inner">

          {/* LEFT CONTENT */}
          <div className="story-content">

            <div className="story-brand">
              <span className="brand-line"></span>

              <div className="brand-info">
                <span className="brand-name">ONSTAGE</span>
                <span className="brand-tagline-aboutus">
                  Making Music Since 35 Years
                </span>
              </div>
            </div>

            <h2>
              More Than Music.
              <span> It's a Legacy.</span>
            </h2>

            <p>
              At OnStage Music Factory, music is more than just sound — it is
              passion, creativity, and expression. For over 35 years, we have
              been committed to delivering world-class musical instruments and
              professional audio equipment to artists, studios, and music
              enthusiasts.
            </p>

            <p>
              We take pride in being a trusted destination for leading global
              brands, offering a wide range of instruments and professional
              equipment designed to meet the needs of every musician.
            </p>

            <p>
              Whether you are setting up your first home studio, performing
              live on stage, or producing music professionally, OnStage gives
              you the right tools to bring your sound to life.
            </p>

            <div className="story-highlight">
              <div className="highlight-number">35+</div>

              <div className="highlight-text">
                <strong>Years of Musical Excellence</strong>
                <span>
                  Building trust, empowering musicians and shaping the music
                  industry.
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT STORES */}
          <div className="stores-section">

            <div className="stores-heading">
              <span>OUR SHOWROOMS</span>
              <h3>Experience Music <em>In Person</em></h3>
            </div>

            <div className="stores-grid">

              {stores.map((store, index) => (
                <div
                  className={`store-card store-${index + 1}`}
                  key={store.name}
                >
                  <img
                    src={store.image}
                    alt={`${store.name} OnStage showroom`}
                    loading="lazy"
                  />

                  <div className="store-overlay">
                    <span className="store-location">
                      ONSTAGE MUSIC FACTORY
                    </span>

                    <h4>{store.name}</h4>

                    <span className="store-arrow">↗</span>
                  </div>
                </div>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="stats-section">
        <div className="stats-inner">

          {statsData.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <div className="stat-number">
                <Counter end={stat.value} />
                <span>+</span>
              </div>

              <div className="stat-label">
                {stat.label}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ================= MISSION / VISION ================= */}
      <section className="about-boxes">

        <div className="about-box mission">
          <div className="box-number">01</div>

          <div>
            <span className="box-label">WHAT DRIVES US</span>

            <h3>Our Mission</h3>

            <p>
              To empower every musician with world-class musical instruments,
              innovative audio solutions and exceptional customer service while
              making premium music equipment accessible across India.
            </p>
          </div>
        </div>

        <div className="about-box vision">
          <div className="box-number">02</div>

          <div>
            <span className="box-label">WHERE WE ARE GOING</span>

            <h3>Our Vision</h3>

            <p>
              To become India's most trusted destination for musical
              instruments, professional audio equipment and creative
              innovation, inspiring every artist to perform with confidence.
            </p>
          </div>
        </div>

      </section>

      {/* ================= WHY ONSTAGE ================= */}
      <section className="about-why">

        <div className="why-heading">
          <span>WHY ONSTAGE</span>

          <h2>
            Everything You Need
            <br />
            <em>To Create Your Sound</em>
          </h2>
        </div>

        <div className="why-grid">

          <div className="why-card">
            <span className="why-number">01</span>
            <div className="why-icon">◈</div>

            <h3>Premium Global Brands</h3>

            <p>
              Discover internationally trusted musical instrument and audio
              equipment brands.
            </p>
          </div>

          <div className="why-card">
            <span className="why-number">02</span>
            <div className="why-icon">✓</div>

            <h3>100% Genuine Products</h3>

            <p>
              Every product is sourced through trusted and authorized
              distribution channels.
            </p>
          </div>

          <div className="why-card">
            <span className="why-number">03</span>
            <div className="why-icon">→</div>

            <h3>Fast Delivery</h3>

            <p>
              Safe, reliable and quick shipping solutions across India.
            </p>
          </div>

          <div className="why-card">
            <span className="why-number">04</span>
            <div className="why-icon">◎</div>

            <h3>Expert Support</h3>

            <p>
              Our experienced team helps you choose the right equipment for
              your musical journey.
            </p>
          </div>

          <div className="why-card">
            <span className="why-number">05</span>
            <div className="why-icon">♫</div>

            <h3>Studio & Live Solutions</h3>

            <p>
              Complete solutions for home studios, professional studios and
              live performances.
            </p>
          </div>

          <div className="why-card">
            <span className="why-number">06</span>
            <div className="why-icon">+</div>

            <h3>After Sales Service</h3>

            <p>
              Reliable assistance and support even after your purchase.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

