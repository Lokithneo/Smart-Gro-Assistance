const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const products = [
  {
    name: "Milk",
    sku: "MILK001",
    price: 40,
    quantity: 50,
    description: "1 liter full cream milk",
    image: "https://images.unsplash.com/photo-1582719478181-fd5b68f8d108",
    expiryDate: new Date("2025-11-10"),
    category: "Dairy",
  },
  {
    name: "Bread",
    sku: "BREAD001",
    price: 25,
    quantity: 30,
    description: "Whole wheat bread",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec",
    expiryDate: new Date("2025-10-30"),
    category: "Bakery",
  },
  {
    name: "Eggs",
    sku: "EGG001",
    price: 120,
    quantity: 12,
    description: "Pack of 12 eggs",
    image: "https://images.unsplash.com/photo-1589367929900-9cd0c98f5ab1",
    expiryDate: new Date("2025-11-15"),
    category: "Dairy",
  },
  {
    name: "Butter",
    sku: "BUTTER001",
    price: 80,
    quantity: 20,
    description: "Salted butter 200g",
    image: "https://images.unsplash.com/photo-1598514982569-65f41ef55f84",
    expiryDate: new Date("2025-12-05"),
    category: "Dairy",
  },
  {
    name: "Cheese",
    sku: "CHEESE001",
    price: 150,
    quantity: 15,
    description: "Cheddar cheese block",
    image: "https://images.unsplash.com/photo-1600180758895-1f7f0e3300f3",
    expiryDate: new Date("2025-12-15"),
    category: "Dairy",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected. Seeding products...");
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Products added!");
    mongoose.disconnect();
  })
  .catch((err) => console.error(err));
