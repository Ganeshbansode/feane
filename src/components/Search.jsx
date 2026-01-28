import React, { useState } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import "./Search.css";
import { useCart } from "../context/CartContext";
import "./Menu.css";
import Footer from "../components/Footer";

// assets
import d1pizza from "../assets/d1pizza.png";
import d2pizza from "../assets/d2pizza.png";
import d3pizza from "../assets/d3pizza.png";
import fries from "../assets/fries.png";
import pasta1 from "../assets/pasta1.png";
import pasta2 from "../assets/pasta2.png";
import t1burger from "../assets/t1burger.png";
import t3burger from "../assets/t3burger.png";
import tburger from "../assets/tburger.png";

const allItems = [
  { id: 1, title: "Onion Pizza", category: "Pizza", price: 15, img: d1pizza },
  { id: 2, title: "Cheese Pizza", category: "Pizza", price: 17, img: d2pizza },
  { id: 3, title: "Chicken Pizza", category: "Pizza", price: 12, img: d3pizza },
  { id: 4, title: "Veg Burger", category: "Burger", price: 12, img: t1burger },
  { id: 5, title: "Chicken Burger", category: "Burger", price: 14, img: t3burger },
  { id: 6, title: "Delicious Burger", category: "Burger", price: 15, img: tburger },
  { id: 7, title: "Delicious Pasta", category: "Pasta", price: 18, img: pasta1 },
  { id: 8, title: "Cheese Pasta", category: "Pasta", price: 10, img: pasta2 },
  { id: 9, title: "French Fries", category: "Fries", price: 10, img: fries },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const { addToCart, openDrawer } = useCart();

  const results = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-page">
      {/* SEARCH BAR */}
      <div className="search-box">
        <FiSearch />
        <input
          type="text"
          placeholder="Search for meals..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
         {query && (
    <button
      className="cancel-btn"
      onClick={() => setQuery("")}
    >
      ×
    </button>
  )}
      </div>

      {/* RESULTS */}
      {query.trim().length < 2 ? null : results.length === 0 ? (
        <div className="no-result">
          <p>
            Sorry, we couldn’t find anything that matches <b>'{query}'</b>
          </p>
        </div>
      ) : (
        <div className="menu-flex">
          {results.map((item) => (
            <div className="menu-card" key={item.id}>
              <div className="menu-img">
                <img src={item.img} alt={item.title} />
              </div>

              <div className="menu-content">
                <h3>{item.title}</h3>

                <div className="menu-bottom">
                  <span className="price">${item.price}</span>

                  <button
                    className="cart-btn"
                    onClick={() => {
                      addToCart(item);
                      openDrawer();
                    }}
                    
                  >
                    <FiShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
