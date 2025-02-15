const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const uri = process.env.MONGODB_URI;

async function run() {
  try {
    await mongoose.connect(uri, {
      serverApi: { version: "1", strict: true, deprecationErrors: true }
    });
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
run();

// Define the Product model
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
});

const Product = mongoose.model('Product', ProductSchema);

// Routes
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add a new product
router.post('/', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

app.use('/api/products', router);

app.get('/', (req, res) => res.send('POS API'));

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));

