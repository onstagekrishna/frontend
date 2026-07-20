import React from "react";


const BlogDetails = () => {
  return (
    <section className="nd-wrapper">
      <div className="nd-container">

        {/* LEFT SIDE */}
        <div className="nd-left">
          <img
            src="https://pub-ea72df14e59d4f28ad52b8d1ac0153ef.r2.dev/WhatsApp%20Image%202026-02-23%20at%202.07.44%20PM%20(2).jpeg"
            alt="news"
          />

          <div className="nd-overlay">
            <span className="nd-tag">Music</span>

            <h2>
              Best Electric Drum Kits for Beginners in India (2026 Guide)
            </h2>

            <p>
              Discover top drum kits for beginners with best sound quality and budget options.
            </p>

            <span className="nd-date">01 Aug 2026</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="nd-right">
          <h3>Recent News</h3>

          <div className="nd-item">
            <span className="nd-cat">Music</span>
            <p>Top 10 Guitars in India for Beginners (2026)</p>
          </div>

          <div className="nd-item">
            <span className="nd-cat">Update</span>
            <p>Best MIDI Keyboards Under Budget</p>
          </div>

          <div className="nd-item">
            <span className="nd-cat">Review</span>
            <p>Drum vs Electronic Pads: What to Choose?</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default BlogDetails;