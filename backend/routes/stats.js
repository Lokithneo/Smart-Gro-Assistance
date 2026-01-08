const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Bill = require("../models/Bill");

// ✅ Dashboard Statistics Route
router.get("/", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const billCount = await Bill.countDocuments();

    // Optional: You can add more insights later like low stock, top selling, etc.
    res.json({
      productCount,
      billCount,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
