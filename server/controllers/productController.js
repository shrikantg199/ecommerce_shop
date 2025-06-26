const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { name, price, description, imageUrl, countInStock, category } = req.body;

  const product = new Product({
    name,
    price,
    description,
    imageUrl,
    countInStock,
    category,
    user: req.user._id,
  });

  try {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, description, imageUrl, countInStock, category } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      product.countInStock = countInStock;
      product.category = category;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Upload product image
// @route   POST /api/products/upload
// @access  Private/Admin
const uploadProductImage = (req, res) => {
  res.json({ imageUrl: req.file.path });
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const [productCount, userCount, orderCount, totalSalesResult] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ])
    ]);
    const totalSales = totalSalesResult[0]?.total || 0;
    res.json({ productCount, userCount, orderCount, totalSales });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getAdminStats,
}; 