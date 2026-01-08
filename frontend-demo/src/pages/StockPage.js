import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";   // ✅ FIX: Import plugin correctly
import "./ProductsPage.css";

function StockPage() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const getStatus = (product) => {
    const today = new Date();
    const expiry = new Date(product.expiryDate);
    const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);

    if (product.quantity <= 5) return "Low Stock";
    if (diffDays <= 0) return "Expired";
    if (diffDays <= 7) return "Expiring Soon";
    return "In Stock";
  };

  const filteredProducts = products.filter((p) => {
    const status = getStatus(p);
    if (filter === "all") return true;
    if (filter === "low") return status === "Low Stock";
    if (filter === "expiring") return status === "Expiring Soon";
    if (filter === "expired") return status === "Expired";
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Low Stock":
        return "#f59e0b";
      case "Expiring Soon":
        return "#f97316";
      case "Expired":
        return "#ef4444";
      default:
        return "#22c55e";
    }
  };

  // ✅ FIXED PDF DOWNLOAD FUNCTION
  const downloadReport = () => {
    const doc = new jsPDF();

    doc.text("📦 Stock Report", 14, 15);

    const tableData = filteredProducts.map((p, index) => [
      index + 1,
      p.name,
      p.price,
      p.quantity,
      p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : "N/A",
      getStatus(p),
    ]);

    autoTable(doc, {
      startY: 25,
      head: [["#", "Product", "Price (₹)", "Stock", "Expiry", "Status"]],
      body: tableData,
    });

    doc.save("Stock_Report.pdf");
  };

  return (
    <div className="products-page">
      <h1>📦 Smart Retail Stock Management</h1>

      {/* Color Indicators */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
          background: "#f9fafb",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "16px", height: "16px", background: "#22c55e" }}></div>
          <span>In Stock</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "16px", height: "16px", background: "#f59e0b" }}></div>
          <span>Low Stock</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "16px", height: "16px", background: "#f97316" }}></div>
          <span>Expiring Soon</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "16px", height: "16px", background: "#ef4444" }}></div>
          <span>Expired</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "8px", borderRadius: "8px", fontSize: "14px" }}
        >
          <option value="all">All Products</option>
          <option value="low">Low Stock</option>
          <option value="expiring">Expiring Soon</option>
          <option value="expired">Expired</option>
        </select>

        <button className="save-btn" onClick={downloadReport}>
          📄 Download Stock Report
        </button>

        <button
          className="cancel-btn"
          onClick={fetchProducts}
          style={{ backgroundColor: "#3b82f6", color: "#fff" }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Product Table */}
      <div className="products-list">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Stock</th>
                <th>Expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.image || "https://via.placeholder.com/80x60?text=No+Image"}
                      alt={p.name}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.quantity}</td>
                  <td>{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "8px",
                        color: "white",
                        backgroundColor: getStatusColor(getStatus(p)),
                      }}
                    >
                      {getStatus(p)}
                    </span>
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

export default StockPage;
