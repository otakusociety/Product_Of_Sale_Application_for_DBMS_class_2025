const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Load environment variables

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet()); // Add security headers

// MongoDB connection
const uri = process.env.MONGODB_URI;

async function run() {
  try {
    await mongoose.connect(uri, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
run();

// Define the Product model with additional validation
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"], // Added price validation
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock cannot be negative"], // Added stock validation
  },
});

const Product = mongoose.model("Product", ProductSchema);

// Load Swagger Documentation from JSON file
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Routes
const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send({ message: "Error fetching products", error: err });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct); // 201 Created status
  } catch (err) {
    res.status(500).send({ message: "Error adding product", error: err });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).send({ message: "Error updating product", error: err });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).send({ message: "Error deleting product", error: err });
  }
});

// Search products by name
router.get("/search", async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) {
      return res
        .status(400)
        .send({ message: "Name query parameter is required" });
    }
    const products = await Product.find({ name: new RegExp(name, "i") });
    res.json(products);
  } catch (err) {
    res.status(500).send({ message: "Error searching products", error: err });
  }
});

// Filter products by price range
router.get("/filter", async (req, res) => {
  try {
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });
    res.json(products);
  } catch (err) {
    res.status(500).send({ message: "Error filtering products", error: err });
  }
});

app.use("/api/products", router);

app.get("/", (req, res) => res.send("POS API"));

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));

// Graceful shutdown handler
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
