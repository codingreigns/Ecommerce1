const express = require("express");
const {
  readAllProducts,
  createProduct,
  readSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productsController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");
const { readSingleProductReview } = require("../controllers/reviewController");
const router = express.Router();

router.post("/", authenticateUser, authorizePermission("admin"), createProduct);
router.get("/", readAllProducts);

router.post(
  "/uploadImage",
  authenticateUser,
  authorizePermission("admin"),
  uploadImage
);

router.get("/:id", readSingleProduct);
router.get("/:id/reviews", readSingleProductReview);
router.patch(
  "/:id",
  authenticateUser,
  authorizePermission("admin"),
  updateProduct
);
router.delete(
  "/:id",
  authenticateUser,
  authorizePermission("admin"),
  deleteProduct
);

module.exports = router;
