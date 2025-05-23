const { Product } = require("../models/productModel");
const { handleImageUpload } = require("../utils/uploads");
const {
  validateCreateProduct,
  validateProductUpdate,
} = require("../validation");

const createProduct = async (req, res) => {
  const userId = req.user.userId;
  const {
    error,
    value: {
      name,
      price,
      description,
      image,
      category,
      company,
      colors,
      featured,
      freeShipping,
      inventory,
    },
  } = validateCreateProduct(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const product = await Product.create({
    name,
    price,
    description,
    image,
    category,
    company,
    colors,
    featured,
    freeShipping,
    inventory,
    user: userId,
  });
  return res.status(201).json({ product });
};
const readAllProducts = async (req, res) => {
  const products = await Product.find({});
  if (!products) {
    return res.status(404).json({ message: "No products found" });
  }
  return res.json({ products, count: products.length });
};

const readSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId).populate("reviews");
  if (!product) {
    return res.status(404).json({ message: `this product was not found` });
  }
  return res.json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const {
    error,
    value: {
      name,
      price,
      description,
      image,
      category,
      company,
      colors,
      featured,
      freeShipping,
      inventory,
    },
  } = validateProductUpdate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const product = await Product.findByIdAndUpdate(
    productId,
    {
      name,
      price,
      description,
      image,
      category,
      company,
      colors,
      featured,
      freeShipping,
      inventory,
    },
    { new: true, runValidators: true }
  );
  if (!product) {
    return res.status(404).json({ message: `this product was not found` });
  }
  return res.json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: `this product was not found` });
  }
  await product.remove();
  return res.status(200).json({ message: `product removed` });
};

const uploadImage = async (req, res) => {
  console.log(req.files);
  const imagePath = await handleImageUpload(req, res);
  if (!imagePath) return; // response already sent in error cases

  return res.status(200).json({ image: imagePath });
};

module.exports = {
  createProduct,
  readAllProducts,
  readSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
