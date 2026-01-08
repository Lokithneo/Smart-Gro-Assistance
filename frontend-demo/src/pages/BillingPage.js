// UPDATED BillingPage.jsx (email removed, works with backend)
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/AppleTheme.css";
import "./BillingPage.css";

export default function BillingPage() {
  const [products, setProducts] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  useEffect(() => {
    setTotal(
      billItems.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0
      )
    );
  }, [billItems]);

  function addToBill(product) {
    if (!product || product.quantity <= 0) {
      alert("Product out of stock!");
      return;
    }

    setBillItems((prev) => {
      const ex = prev.find((p) => p._id === product._id);
      if (ex) {
        return prev.map((p) =>
          p._id === product._id
            ? { ...p, quantity: Number(p.quantity) + 1 }
            : p
        );
      }

      return [
        ...prev,
        { _id: product._id, name: product.name, price: product.price, quantity: 1 },
      ];
    });
  }

  function updateQuantity(id, qty) {
    if (qty < 1) return;
    setBillItems((prev) =>
      prev.map((it) => (it._id === id ? { ...it, quantity: qty } : it))
    );
  }

  function removeFromBill(id) {
    setBillItems((prev) => prev.filter((it) => it._id !== id));
  }

  async function handleBilling() {
    if (billItems.length === 0) {
      alert("Add items before processing billing");
      return;
    }

    const items = billItems.map((it) => ({ productId: it._id, quantity: Number(it.quantity || 1) }));


    try {
      const res = await axios.post("http://localhost:5000/api/billing", { items });
      const data = res.data;

      alert("Billing Successful ✔");

      // update stock in UI
      if (data.items) {
        const map = {};
        data.items.forEach((i) => (map[i.productId] = i.remainingStock));

        setProducts((prev) =>
          prev.map((p) =>
            map[p._id] !== undefined ? { ...p, quantity: map[p._id] } : p
          )
        );
      }

      setBillItems([]);
      setTotal(0);
    } catch (err) {
      console.log("Billing Error:", err);
      alert("❌ " + (err.response?.data?.error || "Billing failed"));
    }
  }

  function downloadPDF() {
    if (!billItems.length) {
      alert("Add items to download invoice");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;

    doc.setFontSize(20);
    doc.text("Smart Retail - Invoice", margin, 50);

    autoTable(doc, {
      head: [["Product", "Price", "Qty", "Total"]],
      body: billItems.map((it) => [
        it.name,
        it.price,
        it.quantity,
        it.price * it.quantity,
      ]),
      startY: 90,
    });

    doc.text(`Grand Total: ₹${total}`, margin, doc.lastAutoTable.finalY + 30);

    doc.save("invoice.pdf");
  }

  const visibleProducts = products.filter((p) =>
    query
      ? p.name.toLowerCase().includes(query.toLowerCase())
      : true
  );

  return (
    <div className="container">
      <div className="h1">Billing</div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        style={{ marginBottom: 20 }}
      />

      <div className="billing-layout">
        <div className="product-grid">
          {visibleProducts.map((p) => (
            <div
              key={p._id}
              className="product-card-apple"
              onClick={() => addToBill(p)}
            >
              <img
                src={p.image || "https://via.placeholder.com/200"}
                alt={p.name}
              />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
              <p>Stock: {p.quantity}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Current Bill</h3>

          {billItems.length === 0 && <p>No items</p>}

          {billItems.map((it) => (
            <div key={it._id} className="bill-row">
              <span>{it.name}</span>
              <input
                type="number"
                min="1"
                value={it.quantity}
                onChange={(e) => updateQuantity(it._id, Number(e.target.value))}
              />
              <span>₹{it.price * it.quantity}</span>
              <button onClick={() => removeFromBill(it._id)}>X</button>
            </div>
          ))}

          <h3>Total: ₹{total}</h3>

          <button onClick={handleBilling} className="btn btn-primary">
            Process Billing
          </button>
          <button onClick={downloadPDF} className="btn btn-ghost">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
