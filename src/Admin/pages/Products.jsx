import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { getProducts, toggleProduct } from "../services/adminApi";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setProducts(await getProducts());
  };

  return (
    <div className="admin-layout">
     
      <main className="admin-content">
        <h2>Products</h2>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>₹{p.price}</td>
                <td>
                  <button onClick={() => toggleProduct(p.id)}>
                    {p.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
