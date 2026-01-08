import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import StockPage from "./pages/StockPage";
import BillingPage from "./pages/BillingPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">🛒 Smart Retail</div>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/products">Products</Link>
            <Link to="/stock">Stock</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/billing">Billing</Link>
          </nav>
          <div className="sidebar-footer">© 2025 Smart Retail</div>
        </aside>

        <main className="main">
          <motion.header initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }} className="header">
            <div className="header-left">Smart Retail Dashboard</div>
            <div className="header-right">Admin</div>
          </motion.header>

          <div className="content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/stock" element={<StockPage />} />
              <Route path="/billing" element={<BillingPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
