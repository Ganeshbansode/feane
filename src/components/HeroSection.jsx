import "./HeroSection.css";
import hero from "../assets/hero-bg.jpg";
import o1 from "../assets/o1.jpg";
import o2 from "../assets/o2.jpg";
import { FiShoppingCart } from "react-icons/fi";
import { useEffect } from "react";

export default function HeroSection() {
  useEffect(() => {
    localStorage.removeItem("orderItems");
  }, []);

  const addOfferToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("orderItems")) || [];

    const exists = cart.find((i) => i.id === item.id);

    let updated;
    if (exists) {
      updated = cart.map((i) =>
        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      updated = [...cart, { ...item, qty: 1 }];
    }

    localStorage.setItem("orderItems", JSON.stringify(updated));
    alert(`${item.title} added to cart`);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="hero"
        id="home"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="hero-content">
          <h1>Fast Food Restaurant</h1>
          <p>
            Doloremque, itaque aperiam facilis<br />
            rerum, commodi, tempora sapiente ad <br />
            mollitia laborum quam quisquam <br />
            esse error unde.
          </p>

          <button
            className="hero-btn"
            onClick={() => {
              document
                .getElementById("inquiry-footer")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Inquiry Now
          </button>
        </div>
      </section>

      {/* OFFER CARDS */}
      <div className="offer-section" id="offers">
        <div className="offer-card">
          <div className="offer-img">
            <img src={o1} alt="burger" />
          </div>

          <div className="offer-content">
            <h3>Tasty Thursdays</h3>
            <h2>
              20% <span>off</span>
            </h2>

            <button
              className="offer-btn"
              onClick={() =>
                addOfferToCart({
                  id: 101,
                  title: "Tasty Burger Offer",
                  price: 150,
                })
              }
            >
              Order Now <FiShoppingCart />
            </button>
          </div>
        </div>

        <div className="offer-card">
          <div className="offer-img">
            <img src={o2} alt="pizza" />
          </div>

          <div className="offer-content">
            <h3>Pizza Days</h3>
            <h2>
              15% <span>off</span>
            </h2>

            <button
              className="offer-btn"
              onClick={() =>
                addOfferToCart({
                  id: 102,
                  title: "Pizza Day Offer",
                  price: 170,
                })
              }
            >
              Order Now <FiShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
