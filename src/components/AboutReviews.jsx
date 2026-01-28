import { useState } from "react";
import "./AboutReviews.css";

export default function AboutReviews() {

  const reviews = [
    {
      name: "Rohit Patil",
      text: "Amazing food quality and taste. I visit Feane every weekend!",
      stars: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Pooja Desai",
      text: "Fast delivery and friendly staff. Highly recommended.",
      stars: "⭐⭐⭐⭐"
    },
    {
      name: "Akash More",
      text: "Best fast food restaurant in the city. Totally worth it!",
      stars: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Neha Kulkarni",
      text: "Loved the ambience and food quality. Will visit again.",
      stars: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Sanket Jadhav",
      text: "Quick service and tasty burgers.",
      stars: "⭐⭐⭐⭐"
    }
  ];

  const [index, setIndex] = useState(0);

  const next = () => {
    if (index < reviews.length - 3) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div className="reviews-page">
      <h1 className="reviews-title">What Our Customers Say</h1>

      <div className="slider-wrapper">
        <button className="arrow-btn" onClick={prev}>❮</button>

        <div className="reviews-container">
          {reviews.slice(index, index + 3).map((rev, i) => (
            <div className="review-card" key={i}>

              {/* Fake Avatar */}
              <div className="review-avatar">
                {rev.name.charAt(0)}
              </div>

              <p className="review-text">“{rev.text}”</p>
              <div className="review-stars">{rev.stars}</div>
              <div className="review-name">— {rev.name}</div>
            </div>
          ))}
        </div>

        <button className="arrow-btn" onClick={next}>❯</button>
      </div>
    </div>
  );
}
