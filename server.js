require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const Product = require("./models/product"); // ✅ Import your Product model

const app = express();
app.use(express.json());
app.use(cors());

// API Routes
app.use("/products", productRoutes); // e.g., POST /products
app.use("/auth", authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
    res.send("Admin Panel Backend Running...");
});

// ✅ Corrected GET /api/products endpoint
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); // use the Product model
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
