const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// POST - create product
router.post("/", async (req, res) => {
  try {
    const { name, price, quantity, expiryDate, image } = req.body;

    if (!name || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: "Name, price and quantity are required" });
    }

    // Create model instance, be explicit about types
    const product = new Product({
      name: String(name).trim(),
      price: Number(price),
      quantity: Number(quantity),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      image: image ? String(image).trim() : "",
    });

    const saved = await product.save();
    res.status(201).json({ message: "Product saved successfully", product: saved });
  } catch (err) {
    console.error("Error saving product:", err);
    // handle duplicate key (unique index) error gracefully
    if (err.code === 11000) {
      return res.status(409).json({ message: "Product with this name already exists" });
    }
    res.status(500).json({ message: "Failed to save product", error: err.message });
  }
});

// PUT - update product
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (update.price !== undefined) update.price = Number(update.price);
    if (update.quantity !== undefined) update.quantity = Number(update.quantity);
    if (update.expiryDate !== undefined) update.expiryDate = update.expiryDate ? new Date(update.expiryDate) : null;

    const updatedProduct = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
});

// DELETE - remove product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
});

module.exports = router;
