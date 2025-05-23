const express = require("express");
const {
  readAllUsers,
  readSingleUser,
  updateUser,
  showCurrrentUser,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");
const router = express.Router();

router.get("/", authenticateUser, authorizePermission("admin"), readAllUsers);
router.get("/me", authenticateUser, showCurrrentUser);
router.get("/:id", authenticateUser, readSingleUser);
router.patch("/:id", authenticateUser, updateUser);

module.exports = router;
