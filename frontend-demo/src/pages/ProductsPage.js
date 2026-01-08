// src/pages/ProductsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductsPage.css";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    expiryDate: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setFetching(true);
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data || []);
      setFetching(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
      setFetching(false);
    }
  };

  // Handle field changes
  const handleChange = (e) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit add/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || formData.name.trim() === "") {
      setError("Product name is required");
      return;
    }
    if (formData.price === "" || isNaN(Number(formData.price))) {
      setError("Valid price is required");
      return;
    }
    if (formData.quantity === "" || isNaN(Number(formData.quantity))) {
      setError("Valid quantity is required");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
      image: formData.image?.trim() || ""
    };

    try {
      setLoading(true);

      if (editingId) {
        const res = await axios.put(`http://localhost:5000/api/products/${editingId}`, payload);
        alert(res.data?.message || "Product updated successfully!");
      } else {
        const res = await axios.post("http://localhost:5000/api/products", payload);
        alert(res.data?.message || "Product added successfully!");
      }

      setFormData({ name: "", price: "", quantity: "", expiryDate: "", image: "" });
      setEditingId(null);
      await fetchProducts();
    } catch (err) {
      console.error("Save error:", err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      setError(serverMsg || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setError(null);
    setFormData({
      name: product.name || "",
      price: product.price != null ? String(product.price) : "",
      quantity: product.quantity != null ? String(product.quantity) : "",
      expiryDate: product.expiryDate ? product.expiryDate.split("T")[0] : "",
      image: product.image || ""
    });
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setError(null);
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="apple-products-container">
      <h1 className="apple-title">Product Management</h1>

      <div className="apple-card form-card">
        <form onSubmit={handleSubmit} className="apple-form">
          {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}

          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              placeholder="Price (₹)"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="number"
              min="0"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="submit" className="apple-btn-primary" disabled={loading}>
              {loading ? (editingId ? "Updating..." : "Adding...") : editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="apple-btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: "", price: "", quantity: "", expiryDate: "", image: "" });
                }}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="apple-card list-card">
        {fetching ? (
          <p className="no-products">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="no-products">No Products Found</p>
        ) : (
          <table className="apple-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Stock</th>
                <th>Expiry</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img className="product-image" src={p.image || "https://via.placeholder.com/80"} alt={p.name} />
                  </td>
                  <td>{p.name}</td>
                  <td>₹{Number(p.price).toFixed(2)}</td>
                  <td>{p.quantity}</td>
                  <td>{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : "N/A"}</td>

                  <td>
                    <button className="apple-edit" onClick={() => handleEdit(p)} disabled={loading}>
                      Edit
                    </button>
                    <button className="apple-delete" onClick={() => handleDelete(p._id)} disabled={loading}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
