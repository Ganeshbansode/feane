import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">
      <h2>Admin Panel</h2>

      <NavLink to="/admin/dashboard">Dashboard</NavLink>
      <NavLink to="/admin/categories">Categories</NavLink>
      <NavLink to="/admin/products">Products</NavLink>
      <NavLink to="/admin/orders">Orders</NavLink>

      <button
        className="exit-btn"
        onClick={() => navigate("/")}
      >
        Exit Admin
      </button>
    </aside>
  );
}
