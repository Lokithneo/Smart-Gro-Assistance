const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Sale = require("../models/Sale");

// POST /api/chatbot { message: "which products are low?" }
router.post("/", async (req, res) => {
  const { message } = req.body;
  const text = (message || "").toLowerCase();

  try {
    if (text.includes("low") || text.includes("short") || text.includes("stock")) {
      const low = await Product.find({ quantity: { $lte: 10 } }).limit(20);
      return res.json({ reply: `Found ${low.length} low-stock products.`, data: low });
    }
    if (text.includes("expir") || text.includes("expire") || text.includes("expiry")) {
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() + 30);
      const expiring = await Product.find({ expiryDate: { $exists: true, $lte: cutoff } }).limit(20);
      return res.json({ reply: `Found ${expiring.length} products expiring within 30 days.`, data: expiring });
    }
    if (text.includes("top") && text.includes("sell")) {
      // top sellers this month
      const start = new Date(); start.setDate(1); start.setHours(0,0,0,0);
      const pipeline = [
        { $match: { soldAt: { $gte: start } } },
        { $group: { _id: "$product", totalSold: { $sum: "$quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
        { $unwind: "$product" },
        { $project: { totalSold: 1, "product.name": 1, "product.sku": 1 } }
      ];
      const top = await Sale.aggregate(pipeline);
      return res.json({ reply: `Top sellers this month: ${top.length}`, data: top });
    }

    // default fallback
    res.json({ reply: "Sorry — I can answer: low stock, expiring soon, top selling. Try: 'which products are low?'", data: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
