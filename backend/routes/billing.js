// routes/billing.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Bill = require("../models/Bill"); // optional

// Helper: normalize incoming items to { productId, quantity }
function normalizeItems(body) {
  const raw = body.items || body.products || [];
  return raw.map((it) => {
    const productId = it.productId || it._id || it.id || (it.product && it.product._id) || (it.product && it.product);
    const quantity = Number(it.quantity || it.qty || 0);
    return { productId, quantity };
  }).filter(i => i.productId && i.quantity > 0);
}

router.post("/", async (req, res) => {
  try {
    const normalized = normalizeItems(req.body);
    if (!normalized || normalized.length === 0) {
      return res.status(400).json({ error: "No valid items provided. Send items: [{ productId, quantity }, ...]" });
    }

    // load all products involved
    const ids = normalized.map(i => i.productId);
    const products = await Product.find({ _id: { $in: ids } });

    const prodMap = {};
    products.forEach(p => { prodMap[p._id.toString()] = p; });

    const insufficient = [];
    let computedTotal = 0;
    const updates = [];

    // validate stock first
    for (const it of normalized) {
      const p = prodMap[it.productId];
      if (!p) {
        return res.status(404).json({ error: `Product not found: ${it.productId}` });
      }
      if (p.quantity < it.quantity) {
        insufficient.push({ id: it.productId, name: p.name || "Unknown", available: p.quantity, requested: it.quantity });
      }
    }

    if (insufficient.length > 0) {
      return res.status(400).json({ error: "Insufficient stock", details: insufficient });
    }

    // All ok — perform updates
    for (const it of normalized) {
      const p = prodMap[it.productId];
      p.quantity = p.quantity - it.quantity;
      updates.push(p.save());
      const itemTotal = (p.price || 0) * it.quantity;
      computedTotal += itemTotal;
    }

    await Promise.all(updates);

    // Optional: save bill history
    let savedBill = null;
    try {
      if (typeof Bill !== "undefined") {
        const billDoc = new Bill({
          customerName: req.body.customerName || "Guest",
          items: normalized.map(it => {
            const p = prodMap[it.productId];
            return {
              product: it.productId,
              name: p.name,
              quantity: it.quantity,
              price: p.price,
              total: (p.price || 0) * it.quantity
            };
          }),
          total: computedTotal,
          date: new Date()
        });
        savedBill = await billDoc.save();
      }
    } catch (e) {
      // non-fatal
      console.error("Could not save bill history:", e);
    }

    const responseItems = normalized.map(it => {
      const p = prodMap[it.productId];
      return {
        productId: it.productId,
        name: p.name,
        sold: it.quantity,
        remainingStock: p.quantity,
        price: p.price,
        total: (p.price || 0) * it.quantity
      };
    });

    res.status(201).json({
      message: "Billing successful",
      total: computedTotal,
      items: responseItems,
      billId: savedBill ? savedBill._id : undefined
    });

  } catch (err) {
    console.error("Billing route error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

module.exports = router;
