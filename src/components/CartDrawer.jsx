import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";
import "./CartDrawer.css";

export default function CartDrawer() {
  const {
    cartItems,
    isDrawerOpen,
    closeDrawer,
    increaseQty,
    decreaseQty,
    removeItem,
  } = useCart();

  // ✅ SCROLL LOCK / UNLOCK FIX
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return createPortal(
    <>
      {/* Overlay */}
      <div className="drawer-overlay" onClick={closeDrawer} />

      {/* Drawer */}
      <div className="cart-drawer">
        {/* Header */}
        <div className="drawer-header">
          <h3>Your Cart</h3>
          <FiX className="close-icon" onClick={closeDrawer} />
        </div>

        {/* Body */}
        <div className="drawer-body">
          {cartItems.length === 0 && (
            <p className="empty-cart">Your cart is empty</p>
          )}

          {cartItems.map((item) => (
            <div className="drawer-item" key={item.id}>
              <img src={item.img} alt={item.title} />

              <div className="drawer-info">
                <h4>{item.title}</h4>
                <p className="item-price">${item.price}</p>

                <div className="qty-row">
                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </div>

                  <span className="item-total">
                    ${item.price * item.qty}
                  </span>
                </div>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeItem(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <div className="total-row">
            <span>Total</span>
            <strong>${totalAmount}</strong>
          </div>

          <button className="checkout-btn">
            {cartItems.length} item{cartItems.length > 1 ? "s" : ""} • $
            {totalAmount}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
