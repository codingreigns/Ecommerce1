const express = require("express");
const {
  createOrder,
  readAllOrders,
  readOrder,
  updateOrder,
  deleteOrder,
  readCurrentUserOrders,
} = require("../controllers/ordersController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");
const router = express.Router();

router.post("/", authenticateUser, createOrder);
router.get("/", authenticateUser, authorizePermission("admin"), readAllOrders);
router.get("/showAllMyOrders", authenticateUser, readCurrentUserOrders);
router.get("/:id", authenticateUser, readOrder);
router.patch("/:id", authenticateUser, updateOrder);
router.delete("/:id", authenticateUser, deleteOrder);

module.exports = router;
