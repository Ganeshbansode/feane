import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const orderPlacedRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  /* ADDRESS FIELDS */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  /* AUTH CHECK */
  useEffect(() => {
    if (!user) navigate("/account");
  }, [user, navigate]);

  /* CART CHECK */
  useEffect(() => {
    if (orderPlacedRef.current) return;
    if (cartItems.length === 0 && !loading) navigate("/cart");
  }, [cartItems.length, loading, navigate]);

  /* TOTAL */
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

 /* PLACE ORDER */
const placeOrder = async () => {
  // ✅ FIRST NAME REQUIRED
  if (!firstName.trim()) {
    alert("Please enter First Name");
    return;
  }

  // ✅ LAST NAME REQUIRED
  if (!lastName.trim()) {
    alert("Please enter Last Name");
    return;
  }

  // ✅ MOBILE NUMBER 10 DIGIT REQUIRED
  if (!/^[6-9]\d{9}$/.test(phone)) {
    alert("Please enter valid 10-digit mobile number");
    return;
  }

  // (Your existing validation stays)
  if (!address1 || !city || !pincode) {
    alert("Please fill all required address fields");
    return;
  }

  if (paymentMethod !== "COD") {
    alert("Please select payment method");
    return;
  }

    if (paymentMethod !== "COD") {
      alert("Please select payment method");
      return;
    }

    // ✅ BUILD FULL ADDRESS (OPTIONAL SAFE)
    const fullAddress = `
${firstName} ${lastName}
Phone: ${phone}
${address1} ${address2}
${city}, ${stateName}
PIN: ${pincode}
`.trim();

    setLoading(true);

    try {
      // DELIVERY CHECK
      const checkRes = await fetch(
        "http://localhost:5000/api/check-address",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: fullAddress, pincode }),
        }
      );

      const checkData = await checkRes.json();

      if (!checkData.allowed) {
        alert(checkData.message || "Delivery not available");
        setLoading(false);
        return;
      }

      // PLACE ORDER
      const res = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // sku code added
       body: JSON.stringify({
  items: JSON.stringify(
    cartItems.map(item => ({
      sku: item.sku,
      title: item.title,
      qty: item.qty,
      price: item.price,
    }))
  ),
  total,
  email: user.email,
  address: fullAddress,
  pincode,
}),
      });

      const data = await res.json();

      if (data.success) {
        alert("🎉 Order placed successfully!");
        orderPlacedRef.current = true;
        clearCart();
        navigate("/account", {
          state: { tab: "orders", refresh: Date.now() },
        });
      } else {
        alert(data.message || "Order failed");
      }
    } catch (err) {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-wrapper">

        {/* LEFT */}
        <div className="checkout-left">
          <h3>Delivery Address</h3>

          <div className="form-row">
            <input
              type="text"
              placeholder="First Name *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="form-row full">
            <input
              type="text"
              placeholder="Phone Number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-row full">
            <input
              type="text"
              placeholder="Address Line 1 *"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </div>

          <div className="form-row full">
            <input
              type="text"
              placeholder="Address Line 2 (Optional)"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="City *"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />
          </div>

          <div className="form-row full">
            <input
              type="text"
              className="pincode-input"
              placeholder="PIN Code *"
              maxLength="6"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>

          <div className="default-address">
            <input type="checkbox" id="defaultAddr" />
            <label htmlFor="defaultAddr">Set as default address</label>
          </div>
        </div>

        {/* RIGHT */}
        <div className="checkout-right">
          <h3>Bill Summary</h3>

          <div className="bill-row">
            <span>Total Items</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="bill-row total">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>

          <div className="payment-section">
            <h4>Select Payment Method</h4>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div>
                <strong>Cash On Delivery</strong>
                <p>Pay After You Get Your Order</p>
              </div>
            </label>
          </div>

          <button
            className="place-order-btn"
            onClick={placeOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "🛒 PLACE ORDER"}
          </button>
        </div>

      </div>
    </div>
  );
}
