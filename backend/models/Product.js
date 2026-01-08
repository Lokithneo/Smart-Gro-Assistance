// models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  // keep "quantity" as the single source of stock (frontend uses .quantity)
  quantity: { type: Number, required: true, default: 0 },
  category: { type: String, default: "" },
  image: { type: String, default: "" },
  expiryDate: { type: Date, default: null }
}, { timestamps: true });

// Note: intentionally NOT defining any unique 'sku' index here to avoid duplicate-null errors.
// If you want sku uniqueness, add it and ensure you always send a sku value on create.

module.exports = mongoose.model("Product", ProductSchema);
