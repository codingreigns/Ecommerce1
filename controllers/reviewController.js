const { Product } = require("../models/productModel");
const { Review } = require("../models/reviewModel");
const { checkAuthorization } = require("../utils/jwt");
const {
  validateCreateProductReview,
  validateUpdateProductReview,
} = require("../validation");

const createReview = async (req, res) => {
  const { userId } = req.user;
  console.log(userId);
  const {
    error,
    value: { title, comment, rating, product: productId },
  } = validateCreateProductReview(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const isValidProduct = await Product.findById(productId);
  if (!isValidProduct) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  const alreadySubmitted = await Review.findOne({
    user: userId,
    product: productId,
  });
  if (alreadySubmitted) {
    return res.status(400).json({ error: "Already submitted review" });
  }
  const review = await Review.create({
    title,
    comment,
    rating,
    product: productId,
    user: userId,
  });
  return res.status(201).json(review);
};

const readAllReviews = async (req, res) => {
  const reviews = await Review.find()
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({ path: "user", select: "name email" });
  return res.status(200).json({ reviews, count: reviews.length });
};

const readSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId)
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({ path: "user", select: "name email" });
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  return res.status(200).json(review);
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const {
    error,
    value: { title, comment, rating },
  } = validateUpdateProductReview(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  const isTheSameUser = checkAuthorization(req, review.user);
  if (!isTheSameUser)
    return res
      .status(403)
      .json({ msg: "you cannot update this review, please create your own" });
  review.title = title;
  review.comment = comment;
  review.rating = rating;
  await review.save();
  return res.status(200).json(review);
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  const isTheSameUser = checkAuthorization(req, review.user);
  if (!isTheSameUser)
    return res
      .status(403)
      .json({ msg: "you cannot delete this review, please create your own" });
  await review.remove();
  return res.status(200).json({ message: "Review deleted successfully" });
};

const readSingleProductReview = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  return res.json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  readAllReviews,
  readSingleReview,
  updateReview,
  deleteReview,
  readSingleProductReview,
};
