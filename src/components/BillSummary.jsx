
import { useCart } from "../context/CartContext";

export default function BillSummary() {
  const { cartItems } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="bill-summary">
      <h3>Bill Summary</h3>

      {cartItems.map((item) => (
        <div key={item.id} className="bill-item">
          <span>
            {item.name} x {item.qty}
          </span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}

      <hr />

      <h4>Total: ₹{total}</h4>
    </div>
  );
}
