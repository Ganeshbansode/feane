import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/admin/dashboard")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      <h2>Welcome to Admin Panel</h2>

      <div className="admin-stats">
        <div className="stat-card">Categories: {stats.categories}</div>
        <div className="stat-card">Products: {stats.products}</div>
        <div className="stat-card">Active Products: {stats.activeProducts}</div>
      </div>
    </>
  );
}
