import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavourite } from "../context/FavouriteContext";
import "./Account.css";
import { useLocation } from "react-router-dom";



export default function Account() {
  const { user, logout } = useAuth();
  const { totalQty, addToCart, openDrawer } = useCart();
  const { favourites, toggleFavourite } = useFavourite();
  const location = useLocation();


  const [tab, setTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);

// 🔹 Address states (ALWAYS before any return)
const [address, setAddress] = useState("");
const [addressStatus, setAddressStatus] = useState("");
const [checking, setChecking] = useState(false);


useEffect(() => {
  if (location.state?.tab) {
    setTab(location.state.tab);
  }
}, [location.state]);


// ================= FETCH ORDERS =================
useEffect(() => {
  if (!user || tab !== "orders") return;

  fetch(`http://localhost:5000/api/orders?email=${user.email}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    })
    .catch(() => setOrders([]));
}, [tab, user]);



// ✅ SAFE early return (AFTER hooks)
if (!user) return null;


  // ================= CHECK ADDRESS =================
  const checkAddress = async () => {
    if (!address.trim()) {
      setAddressStatus("Please enter address");
      return;
    }

    setChecking(true);
    setAddressStatus("");

    try {
      const res = await fetch("http://localhost:5000/api/check-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (data.allowed) {
        localStorage.setItem("verifiedAddress", address);
        setAddressStatus(
          `✅ Delivery available (${data.distanceKm} km, ${data.durationMin} min)`
        );
      } else {
        localStorage.removeItem("verifiedAddress");
        setAddressStatus("❌ Out of delivery range");
      }
    } catch (err) {
      setAddressStatus("Something went wrong");
    }

    setChecking(false);
  };

  return (
    <div className="account-wrapper">
      {/* LEFT SIDEBAR */}
      <aside className="account-sidebar">
        <button
          className={tab === "dashboard" ? "active" : ""}
          onClick={() => setTab("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>

        <button
          className={tab === "wishlist" ? "active" : ""}
          onClick={() => setTab("wishlist")}
        >
          Wishlist
        </button>

        <button
          className={tab === "address" ? "active" : ""}
          onClick={() => setTab("address")}
        >
          Address
        </button>

        <button
          className={tab === "details" ? "active" : ""}
          onClick={() => setTab("details")}
        >
          Account Details
        </button>

        <button
  className="logout-btn"
  onClick={() => {
    logout();
    window.location.href = "/";
  }}
>
  Logout
</button>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="account-main">
        {/* ================= DASHBOARD ================= */}
        {tab === "dashboard" && (
          <div className="account-card">
            <h2>Hello, {user?.name} 👋</h2>
            <p className="muted">Email: {user?.email}</p>

            <div className="stats">
              <div className="stat-box">
                <span>🛒</span>
                <div>
                  <h4>{totalQty}</h4>
                  <p>Cart Items</p>
                </div>
              </div>

              <div className="stat-box">
                <span>❤️</span>
                <div>
                  <h4>{favourites.length}</h4>
                  <p>Wishlist Items</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= WISHLIST ================= */}
        {tab === "wishlist" && (
          <div className="account-card">
            <h2>Your Wishlist</h2>

            {favourites.length === 0 ? (
              <p className="muted">No items in your wishlist ❤️</p>
            ) : (
              <div className="wishlist-grid">
                {favourites.map((item) => (
                  <div key={item.id} className="wishlist-item">
                    <img src={item.img} alt={item.title} />
                    <h4>{item.title}</h4>
                    <p>₹{item.price}</p>

                    <button
                      className="remove-btn"
                      onClick={() => toggleFavourite(item)}
                    >
                      ❌ Remove
                    </button>

                    <button
                      className="add-cart-btn"
                      onClick={() => {
                        addToCart(item);
                        openDrawer();
                      }}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ORDERS ================= */}
        {tab === "orders" && (
          <div className="account-card">
            <h2>Your Orders</h2>

            {orders.length === 0 ? (
              <p className="muted">No orders found</p>
            ) : (
              orders.map((order) => {
                let items = [];
                try {
                  items = JSON.parse(order.items);
                } catch {
                  items = [];
                }

                return (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h4>Order</h4>
                        <span className="order-status">PLACED</span>
                      </div>
                      <p className="order-total">₹{order.total}</p>
                    </div>

                   <ul className="order-items">
  {items.map((it, idx) => (
    <li key={it.sku || idx}>
      <div>
        <strong>{it.title}</strong>
        <div className="muted">SKU: {it.sku}</div>
        <div className="muted">Qty: {it.qty}</div>
      </div>
      <span>₹{it.price}</span>
    </li>
  ))}
</ul>

                    
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ================= ADDRESS ================= */}
        {tab === "address" && (
          <div className="account-card">
            <h2>Delivery Address</h2>

            <textarea
              className="address-input"
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button
              className="check-address-btn"
              onClick={checkAddress}
              disabled={checking}
            >
              {checking ? "Checking..." : "Check Address"}
            </button>

            {addressStatus && (
              <p className="address-status">{addressStatus}</p>
            )}
          </div>
        )}

       {/* ================= DETAILS ================= */}
{tab === "details" && (
  <AccountDetails user={user} />
)}
      </main>
    </div>
  );
}

function AccountDetails({ user }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/api/account?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          displayName: data.displayName || "",
          email: data.email || user.email,
        }));
      });
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setMsg("");
    setError("");

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:5000/api/account/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      setMsg("✅ Account details updated successfully");
      setForm({
        ...form,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setError(data.message || "Update failed");
    }
  };

  return (
    <div className="account-card">
      <h2>Account Details</h2>

      <div className="details-grid">
        <div>
          <label>First Name *</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} />
        </div>

        <div>
          <label>Last Name *</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} />
        </div>
      </div>

      <label>Display Name *</label>
      <input name="displayName" value={form.displayName} onChange={handleChange} />

      <label>Email Address *</label>
      <input value={form.email} disabled />

      <h3 className="section-title">Password Change</h3>

      <label>Current Password</label>
      <input
        type="password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
      />

      <div className="details-grid">
        <div>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>

      {msg && <p className="success-msg">{msg}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}

