import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./ReportsPage.css";

export default function ReportsPage() {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const data = res.data;

      setProducts(data);

      setLowStock(data.filter((p) => p.quantity <= 5));

      setExpiringSoon(
        data.filter((p) => {
          if (!p.expiryDate) return false;
          const exp = new Date(p.expiryDate);
          const now = new Date();
          const diff = (exp - now) / (1000 * 3600 * 24);
          return diff > 0 && diff <= 7;
        })
      );

      setRecentProducts([...data].reverse().slice(0, 5));
    } catch (err) {
      console.error("Report loading error:", err);
    }
  };

  const downloadPDF = (title, tableData, headers) => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);

    doc.autoTable({
      startY: 25,
      head: [headers],
      body: tableData,
    });

    doc.save(`${title}.pdf`);
  };

  return (
    <div className="report-container">
      <h1 className="report-title">📊 Smart Retail Reports</h1>

      {/* ---------- SUMMARY CARDS ---------- */}
      <div className="summary-grid">
        <div className="summary-card total">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>

        <div className="summary-card low">
          <h3>Low Stock</h3>
          <p>{lowStock.length}</p>
        </div>

        <div className="summary-card expiring">
          <h3>Expiring Soon</h3>
          <p>{expiringSoon.length}</p>
        </div>

        <div className="summary-card new">
          <h3>Recently Added</h3>
          <p>{recentProducts.length}</p>
        </div>
      </div>

      {/* ---------- LOW STOCK TABLE ---------- */}
      <section className="report-section">
        <div className="section-header">
          <h2>⚠️ Low Stock Products</h2>
          <button
            onClick={() =>
              downloadPDF(
                "Low_Stock_Report",
                lowStock.map((p) => [
                  p.name,
                  p.price,
                  p.quantity,
                  p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : "N/A",
                ]),
                ["Product", "Price", "Qty", "Expiry"]
              )
            }
          >
            📄 Download PDF
          </button>
        </div>

        {lowStock.length === 0 ? (
          <p>No low stock items 🎉</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Qty</th>
                <th>Expiry</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.quantity}</td>
                  <td>{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ---------- EXPIRING SOON ---------- */}
      <section className="report-section">
        <div className="section-header">
          <h2>⏳ Expiring Soon</h2>
          <button
            onClick={() =>
              downloadPDF(
                "Expiring_Soon_Report",
                expiringSoon.map((p) => [
                  p.name,
                  p.price,
                  p.quantity,
                  new Date(p.expiryDate).toLocaleDateString(),
                ]),
                ["Product", "Price", "Qty", "Expiry"]
              )
            }
          >
            📄 Download PDF
          </button>
        </div>

        {expiringSoon.length === 0 ? (
          <p>No products expiring soon 🎉</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Qty</th>
                <th>Expiry</th>
              </tr>
            </thead>
            <tbody>
              {expiringSoon.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.quantity}</td>
                  <td>{new Date(p.expiryDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ---------- RECENT PRODUCTS ---------- */}
      <section className="report-section">
        <h2>🆕 Recently Added Products</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Qty</th>
              <th>Added On</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.quantity}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
