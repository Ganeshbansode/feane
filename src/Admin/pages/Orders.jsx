import AdminSidebar from "../components/AdminSidebar";
import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders?email=admin")
      .then(res => res.json())
      .then(data => setOrders(data.orders || []));
  }, []);

  return (
    <div className="admin-layout">
      
      <main className="admin-content">
        <h2>Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>₹{o.total}</td>
                  <td>{o.status || "PLACED"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
