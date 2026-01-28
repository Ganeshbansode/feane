import React, { useState } from "react";
import "./Menu.css";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useCart } from "../context/CartContext";
import { useFavourite } from "../context/FavouriteContext";
import d1pizza from "../assets/d1pizza.png";
import d2pizza from "../assets/d2pizza.png";
import d3pizza from "../assets/d3pizza.png";
import fries from "../assets/fries.png";
import pasta1 from "../assets/pasta1.png";
import pasta2 from "../assets/pasta2.png";
import t1burger from "../assets/t1burger.png";
import t3burger from "../assets/t3burger.png";
import tburger from "../assets/tburger.png";

export default function Menu() {
  const { addToCart, openDrawer } = useCart();

  // ❤️ Favourite state
  const { toggleFavourite, isFavourite } = useFavourite();

  const allItems = [
    { id: 1, title: "Onion Pizza", category: "Pizza",sku: "PIZ-ON-01", price: 120, img: d1pizza },
    { id: 2, title: "Cheese Pizza", category: "Pizza",sku: "PIZ-CH-02", price: 160, img: d2pizza },
    { id: 3, title: "Chicken Pizza", category: "Pizza",sku: "PIZ-CK-03", price: 170, img: d3pizza },
 
    { id: 4, title: "Veg Burger", category: "Burger",sku: "BUR-VG-01", price: 120, img: t1burger },
    { id: 5, title: "Chicken Burger", category: "Burger",sku: "BUR-CK-02", price: 140, img: t3burger },
    { id: 6, title: "Delicious Burger", category: "Burger",sku: "BUR-DL-03", price: 130, img: tburger },

    { id: 7, title: "Delicious Pasta", category: "Pasta",sku: "PAS-DL-01", price: 100, img: pasta1 },
    { id: 8, title: "Cheese Pasta", category: "Pasta",sku: "PAS-CH-02", price: 150, img: pasta2 },

    { id: 9, title: "French Fries", category: "Fries", sku: "FRI-FF-01", price: 110, img: fries },
  ];

  const [filter, setFilter] = useState("All");

  const filteredItems =
    filter === "All"
      ? allItems
      : allItems.filter((item) => item.category === filter);

  return (
    <section className="menu-section" id="menu">
      <h2 className="menu-title">Our Menu</h2>

      {/* FILTERS */}
      <div className="menu-filters">
        {["All", "Burger", "Pizza", "Pasta", "Fries"].map((cat) => (
          <button
            key={cat}
            className={filter === cat ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MENU CARDS */}
      <div className="menu-flex">
        {filteredItems.map((item) => (
          <div className="menu-card" key={item.id}>
            <div className="menu-img">
              <img src={item.img} alt={item.title} />

              {/* ❤️ Favourite icon */}
              <span
  className={`fav-icon ₹{isFavourite(item.id) ? "active" : ""}`}
  onClick={() => toggleFavourite(item)}
>
  {isFavourite(item.id) ? <AiFillHeart /> : <AiOutlineHeart />}
</span>
            </div>

            <div className="menu-content">
              <h3>{item.title}</h3>
              <p>
                Veniam debitis quaerat officiis quasi cupiditate quo, quisquam
                velit, magnam voluptatem repellendus sed eaque.
              </p>

              <div className="menu-bottom">
                <span className="price">₹{item.price}</span>

                {/* 🛒 ADD TO CART */}
                <button
                  className="cart-btn"
                  onClick={() => {
                    addToCart(item);
                    openDrawer();
                  }}
                >
                  <FiShoppingCart className="cart-icon" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <button className="view-more-btn">View More</button> */}
    </section>
  );
}