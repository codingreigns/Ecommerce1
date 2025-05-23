const Joi = require("joi");
const { userSchema } = require("./models/userModel");
const { productSchema } = require("./models/productModel");
const { reviewSchema } = require("./models/reviewModel");
const { orderSchema } = require("./models/orderModel");

function validateNewUser(userInfo) {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(3).max(50),
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().min(6).max(12),
  });
  return schema.validate(userInfo, userSchema);
}

function validateUserLogin(userInfo) {
  const schema = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().min(6).max(12),
  });
  return schema.validate(userInfo, userSchema);
}

function validateUserUpdate(userInfo) {
  const schema = Joi.object({
    newPassword: Joi.string().required().min(6).max(12),
    oldPassword: Joi.string().required().min(6).max(12),
    name: Joi.string().required().trim().min(3).max(50).optional(),
  });
  return schema.validate(userInfo, userSchema);
}

function validateCreateProduct(productInfo) {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(3).max(50),
    price: Joi.number().required().min(0),
    description: Joi.string().required().trim().min(3).max(1000),
    image: Joi.string().optional(),
    category: Joi.string().required().valid("office", "kitchen", "bedroom"),
    company: Joi.string().required().valid("ikea", "liddy", "marcos"),
    colors: Joi.array().items(Joi.string()).required(),
    featured: Joi.boolean().default(false),
    freeShipping: Joi.boolean().default(false),
    inventory: Joi.number().required().min(0),
    user: Joi.string().optional(),
    averageRating: Joi.number().optional(),
  });
  return schema.validate(productInfo, productSchema);
}

function validateProductUpdate(productInfo) {
  const schema = Joi.object({
    name: Joi.string().optional().trim().min(3).max(50),
    price: Joi.number().optional().min(0),
    description: Joi.string().optional().trim().min(3).max(1000),
    image: Joi.string().optional(),
    category: Joi.string().optional().valid("office", "kitchen", "bedroom"),
    company: Joi.string().optional().valid("ikea", "liddy", "marcos"),
    colors: Joi.array().items(Joi.string()).optional(),
    featured: Joi.boolean().default(false),
    freeShipping: Joi.boolean().default(false),
    inventory: Joi.number().optional().min(0),
  });
  return schema.validate(productInfo, productSchema);
}

function validateCreateProductReview(reviewInfo) {
  const schema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required().trim().min(3).max(1000),
    title: Joi.string().required().trim().min(3).max(100),
    product: Joi.string().required(),
  });
  return schema.validate(reviewInfo, reviewSchema);
}

function validateUpdateProductReview(reviewInfo) {
  const schema = Joi.object({
    rating: Joi.number().optional().min(1).max(5),
    comment: Joi.string().optional().trim().min(3).max(1000),
    title: Joi.string().optional().trim().min(3).max(100),
  });
  return schema.validate(reviewInfo, reviewSchema);
}

function validateCreateOrder(orderInfo) {
  const schema = Joi.object({
    orderItems: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          image: Joi.string().required(),
          price: Joi.number().required(),
          amount: Joi.number().required(),
          product: Joi.string().required(),
        })
      )
      .required()
      .not()
      .empty(),
    tax: Joi.number().required(),
    shippingFee: Joi.number().required(),
    subTotal: Joi.number().required(),
    total: Joi.number().required(),
  });
  return schema.validate(orderInfo, orderSchema);
}

function validateUpdateOrder(orderInfo) {
  const schema = Joi.object({
    status: Joi.string()
      .valid("pending", "paid", "delivered", "cancelled", "failed")
      .required(),
    paymentIntentId: Joi.string().required(),
  });
  return schema.validate(orderInfo, orderSchema);
}

module.exports = {
  validateNewUser,
  validateUserLogin,
  validateUserUpdate,
  validateCreateProduct,
  validateProductUpdate,
  validateCreateProductReview,
  validateUpdateProductReview,
  validateCreateOrder,
  validateUpdateOrder,
};
