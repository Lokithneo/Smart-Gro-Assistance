import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setRecentProducts(res.data.slice(-5).reverse()))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <h2 className="dashboard-title">📊 Smart Retail Dashboard</h2>

      {/* TOP CARDS */}
      <div className="dashboard-cards">

        <div className="dash-card">
          <h3>Total Products</h3>
          <p>{recentProducts.length}</p>
        </div>

        <div className="dash-card">
          <h3>Low Stock Alerts</h3>
          <p>{recentProducts.filter(p => p.quantity <= 5).length}</p>
        </div>

        <div className="dash-card">
          <h3>Expired Items</h3>
          <p>{recentProducts.filter(p => new Date(p.expiryDate) < new Date()).length}</p>
        </div>

        <div className="dash-card">
          <h3>Expiring Soon</h3>
          <p>{recentProducts.filter(p => {
            const d = new Date(p.expiryDate);
            const today = new Date();
            const next7 = new Date();
            next7.setDate(today.getDate() + 7);
            return d >= today && d <= next7;
          }).length}</p>
        </div>

      </div>

      {/* RECENT PRODUCTS TABLE */}
      <div className="recent-section">
        <h3 className="recent-title">📦 Recent Products</h3>

        <div className="table-container">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Expiry</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-msg">
                    No products available
                  </td>
                </tr>
              ) : (
                recentProducts.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.quantity}</td>
                    <td>₹{p.price}</td>
                    <td>{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : "N/A"}</td>
                    <td>
                      {p.quantity <= 5 ? (
                        <span className="status-low">Low Stock</span>
                      ) : (
                        <span className="status-ok">Healthy</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
