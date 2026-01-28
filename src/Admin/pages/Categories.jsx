import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { getCategories, addCategory, toggleCategory } from "../services/adminApi";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setCategories(await getCategories());
  };

  const add = async () => {
    if (!name) return;
    await addCategory(name);
    setName("");
    load();
  };

  return (
    <div className="admin-layout">
   
      <main className="admin-content">
        <h2>Categories</h2>

        <input
          placeholder="Category name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={add}>Add</button>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>
                  <button onClick={() => toggleCategory(c.id)}>
                    {c.is_active ? "Active" : "Inactive"}
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
