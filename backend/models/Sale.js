const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  priceAtSale: { type: Number, required: true }, // price per item at sale
  total: { type: Number, required: true },
  soldAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sale", SaleSchema);
