import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import "./Cart.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Cart() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeItem,
  } = useCart();

  const { user} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  //  SUCCESS ALERT AFTER ORDER
  useEffect(() => {
    if (location.state?.orderSuccess) {
      alert("🎉 Your order has been placed successfully!");
    }
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // EMPTY CART
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">🛒 Your cart is empty</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2 className="cart-title">Your Cart</h2>

        {cartItems.map((item) => (
          <div className="cart-item" key={item.sku}>
            <img src={item.img} alt={item.title} />

            <div className="cart-info">
              <h4>{item.title}</h4>
              <p>₹{item.price}</p>
            </div>

            <div className="cart-qty">
              <button onClick={() => decreaseQty(item.sku)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => increaseQty(item.sku)}>+</button>
            </div>

            <div className="cart-price">
              <p>₹{item.price * item.qty}</p>
              <button
                className="cart-remove"
                onClick={() => removeItem(item.sku)}
              >
                ❌
              </button>
            </div>
          </div>
        ))}

        {/* SUMMARY */}
        <div className="cart-summary">
          <div className="cart-total">Total: ₹{total}</div>

     <button
  className="checkout-btn"
  onClick={() => {
    if (!user) {
      alert("Please login or sign up to place your order"); // optional
      window.openLoginModal(); // 🔥 OPEN POPUP DIRECTLY
    } else {
      navigate("/checkout");
    }
  }}
>
  PROCEED TO CHECKOUT
</button>

        </div>
      </div>
    </div>
  );
}
