// models/Bill.js
const mongoose = require("mongoose");

const BillItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  quantity: Number,
  price: Number,
  total: Number
});

const BillSchema = new mongoose.Schema({
  customerName: { type: String, default: "Guest" }, // optional
  items: [BillItemSchema],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bill", BillSchema);
