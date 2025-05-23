const express = require("express");
const {
  readAllReviews,
  readSingleReview,
  updateReview,
  deleteReview,
  createReview,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.post("/", authenticateUser, createReview);
router.get("/", readAllReviews);
router.get("/:id", readSingleReview);
router.patch("/:id", authenticateUser, updateReview);
router.delete("/:id", authenticateUser, deleteReview);

module.exports = router;
