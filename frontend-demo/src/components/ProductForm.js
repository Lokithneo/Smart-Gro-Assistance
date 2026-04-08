// ProductForm.js
import React, { useState } from "react";
import { addProduct } from "../api"; // Make sure path to api.js is correct

export default function ProductForm({ refreshProducts }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: 0,
    quantity: 0,
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addProduct({
        name: form.name,
        sku: form.sku,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        description: form.description,
        image: form.image,
      });

      alert("✅ Product added successfully!");
      setForm({ name: "", sku: "", price: 0, quantity: 0, description: "", image: "" });

      // Refresh product list if parent passed a function
      if (refreshProducts) refreshProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      alert("❌ Failed to add product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={change} required />
      <input name="sku" placeholder="SKU" value={form.sku} onChange={change} required />
      <input name="price" placeholder="Price" type="number" value={form.price} onChange={change} required />
      <input name="quantity" placeholder="Quantity" type="number" value={form.quantity} onChange={change} required />
      <input name="description" placeholder="Description" value={form.description} onChange={change} />
      <input name="image" placeholder="Image URL" value={form.image} onChange={change} />
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Create"}
      </button>
    </form>
  );
}