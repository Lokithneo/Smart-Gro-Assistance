const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// 🟡 LOW STOCK → quantity <= threshold
router.get("/low-stock", async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const products = await Product.find({ quantity: { $lte: threshold } }).sort({ quantity: 1 });
    res.json(products);
  } catch (err) {
    console.error("Low stock error:", err);
    res.status(500).json({ message: "Failed to fetch low stock products" });
  }
});

// 🟠 EXPIRING SOON → expiryDate within next X days
router.get("/expiring-soon", async (req, res) => {
  try {
    const days = Number(req.query.days) || 7;
    const today = new Date();
    const upcoming = new Date();
    upcoming.setDate(today.getDate() + days);

    const products = await Product.find({
      expiryDate: { $gte: today, $lte: upcoming }
    }).sort({ expiryDate: 1 });

    res.json(products);
  } catch (err) {
    console.error("Expiring soon error:", err);
    res.status(500).json({ message: "Failed to fetch expiring soon products" });
  }
});

// 🔴 EXPIRED → expiryDate < today
router.get("/expired", async (req, res) => {
  try {
    const today = new Date();
    const products = await Product.find({ expiryDate: { $lt: today } }).sort({ expiryDate: 1 });
    res.json(products);
  } catch (err) {
    console.error("Expired error:", err);
    res.status(500).json({ message: "Failed to fetch expired products" });
  }
});

// ⭐ TOP SELLING → dummy logic using low stock
router.get("/top-selling", async (req, res) => {
  try {
    // Using low quantity as a placeholder for top-selling
    const products = await Product.find().sort({ quantity: 1 }).limit(5);
    res.json(products);
  } catch (err) {
    console.error("Top selling error:", err);
    res.status(500).json({ message: "Failed to fetch top selling products" });
  }
});

module.exports = router;
