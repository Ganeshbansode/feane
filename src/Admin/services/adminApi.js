const BASE = "http://localhost:5000/api";

export const getCategories = async () =>
  fetch(`${BASE}/admin/categories`).then(res => res.json());

export const addCategory = async (name) =>
  fetch(`${BASE}/admin/category`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

export const toggleCategory = async (id) =>
  fetch(`${BASE}/admin/category/${id}/toggle`, { method: "PUT" });

export const getProducts = async () =>
  fetch(`${BASE}/products`).then(res => res.json());

export const toggleProduct = async (id) =>
  fetch(`${BASE}/admin/product/${id}/toggle`, { method: "PUT" });

