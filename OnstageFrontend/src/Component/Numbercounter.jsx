import { useEffect, useState } from "react";

function Counter({ target, suffix }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 4500;
    const increment = target / (duration / 20);

    const timer = setInterval(() => {
      start += increment;

      if (start >= target) {
        start = target;
        clearInterval(timer);
      }

      setCount(Math.floor(start));
    }, 20);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <h2>
      {count}
      {suffix}
    </h2>
  );
}

function Numbercounter() {
  return (
    <section className="number-counter-section">
      <div className="number-counter-wrapper">

        <div className="number-counter-item">
          <Counter target={5} suffix="K+" />
          <p>Products Available</p>
        </div>

        <div className="number-counter-item">
          <Counter target={40} suffix="+" />
          <p>Global Brands</p>
        </div>

        <div className="number-counter-item">
          <Counter target={20} suffix="+" />
          <p>Years of Excellence</p>
        </div>

        <div className="number-counter-item">
          <Counter target={50} suffix="K+" />
          <p>Happy Customers</p>
        </div>

      </div>
    </section>
  );
}

export default Numbercounter;