import React from "react";
import { useNavigate } from "react-router-dom";

const BlogSection = () => {
  const navigate = useNavigate();

  return (
    <section className="blog-section">
      <div className="container">

        <div className="section-title-wrap">
          <div className="stories-heading-wrapper">
            <h2 className="stories-heading">LATEST STORIES</h2>
            <p className="stories-tagline">
              Explore expert insights, industry trends, and inspiring musical stories.
            </p>
          </div>
          {/* <span className="section-line"></span> */}
        </div>

        <div className="blog-grid">

          {/* Featured Post */}
          <div
            className="featured-post"
            onClick={() => navigate("/blog-details")}
            style={{ cursor: "pointer" }}
          >
            <video
              className="featured-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source
                src="https://pub-8fb728ccc32b4c72a6f05fff3cf3d811.r2.dev/clip.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            <div className="overlay" style={{ flexDirection: "column" }}>
              <h3>
                Best Electric Drum Kits for Beginners in India (2026 Guide)
                <span className="blog-read-more"> Read More</span>
              </h3>

              <span className="date">
                Jan 17, 2026 • 0 Comments
              </span>
            </div>
          </div>
          {/* Side Posts */}
          <div className="side-posts">

            <div
              className="post-item"
              onClick={() => navigate("/blog-details")}
              style={{ cursor: "pointer" }}
            >
              <img
                src="https://pub-ea72df14e59d4f28ad52b8d1ac0153ef.r2.dev/WhatsApp%20Image%202026-02-23%20at%202.07.44%20PM%20(3).jpeg"
                alt="Guitar"
              />
              <div className="post-content">
                <span className="date">Jan 01, 2026 • 0 Comments</span>
                <h4>
                  Best Electric Guitars to Buy in India (2026 Edition)
                </h4>
                <span className="blog-read-more">Read More</span>
              </div>
            </div>

            <div
              className="post-item"
              onClick={() => navigate("/blog-details")}
              style={{ cursor: "pointer" }}
            >
              <img
                src="https://pub-ea72df14e59d4f28ad52b8d1ac0153ef.r2.dev/WhatsApp%20Image%202026-02-23%20at%202.07.44%20PM%20(4).jpeg"
                alt="Keyboard"
              />
              <div className="post-content">
                <span className="date">Oct 25, 2025 • 0 Comments</span>
                <h4>
                  MIDI Keyboards vs Digital Pianos: What’s Right for You?
                </h4>
                <span className="blog-read-more">Read More</span>
              </div>
            </div>

            <div
              className="post-item"
              onClick={() => navigate("/blog-details")}
              style={{ cursor: "pointer" }}
            >
              <img
                src="https://pub-ea72df14e59d4f28ad52b8d1ac0153ef.r2.dev/WhatsApp%20Image%202026-02-23%20at%202.07.44%20PM%20(4).jpeg"
                alt="Keyboard"
              />
              <div className="post-content">
                <span className="date">Oct 25, 2025 • 0 Comments</span>
                <h4>
                  MIDI Keyboards vs Digital Pianos: What’s Right for You?
                </h4>
                <span className="blog-read-more">Read More</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;