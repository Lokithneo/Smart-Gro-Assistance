// server.js (Smart Retail Backend)

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const productRoutes = require("./routes/ProductRoutes");
const billingRouter = require("./routes/billing");
const reportsRouter = require("./routes/reports");

const app = express();

// -------------------------
// MIDDLEWARE
// -------------------------
app.use(cors());
app.use(express.json());
app.use(helmet());

// -------------------------
// API ROUTES
// -------------------------
app.use("/api/products", productRoutes);
app.use("/api/billing", billingRouter);
app.use("/api/reports", reportsRouter);

// Health check
app.get("/", (req, res) => {
  res.status(200).send("✅ Smart Retail API running successfully 🚀");
});

// -------------------------
// MONGO CONNECTION
// -------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI) // modern driver automatically handles options
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// -------------------------
// GLOBAL ERROR HANDLER
// -------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// -------------------------
// GRACEFUL SHUTDOWN
// -------------------------
process.on("SIGINT", async () => {
  console.log("\n🛑 Gracefully shutting down...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed.");
  process.exit(0);
});