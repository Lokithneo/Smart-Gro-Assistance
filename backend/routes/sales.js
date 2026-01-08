const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const mongoose = require("mongoose");

// Record a sale: body { productId, quantity }
router.post("/", async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) return res.status(400).json({ error: "productId and quantity required" });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await Product.findById(productId).session(session);
    if (!product) throw new Error("Product not found");
    if (product.quantity < quantity) throw new Error("Insufficient stock");

    product.quantity -= quantity;
    product.totalSold = (product.totalSold || 0) + quantity;
    await product.save({ session });

    const sale = new Sale({
      product: product._id,
      quantity,
      priceAtSale: product.price,
      total: product.price * quantity
    });
    const savedSale = await sale.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ sale: savedSale, product });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
});

// GET sales (optionally by date range)
router.get("/", async (req, res) => {
  try {
    const { from, to } = req.query; // optional ISO dates
    const filter = {};
    if (from || to) filter.soldAt = {};
    if (from) filter.soldAt.$gte = new Date(from);
    if (to) filter.soldAt.$lte = new Date(to);
    const sales = await Sale.find(filter).populate("product");
    res.json(sales);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
