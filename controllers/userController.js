const { User } = require("../models/userModel");
const { checkAuthorization } = require("../utils/jwt");
const { validateUserUpdate } = require("../validation");

const readAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  if (!users) return res.status(404).json({ msg: "No user found" });
  return res.json({ users, nbHits: users.length });
};

const readSingleUser = async (req, res) => {
  const { id: userId } = req.params;

  if (!checkAuthorization(req, userId)) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const user = await User.findById(userId).select("-password");
  if (!user) return res.status(404).json({ msg: "No user found" });
  return res.json(user);
};

const showCurrrentUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById(userId).select("-password");
  if (!user) return res.status(404).json({ msg: "No user found" });
  return res.json(user);
};
const updateUser = async (req, res) => {
  const { userId } = req.user;
  const {
    error,
    value: { name, newPassword, oldPassword },
  } = validateUserUpdate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: "No user found" });
  const isMatch = await user.compareHashedPassword(oldPassword);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid password" });
  }

  if (name) {
    user.name = name;
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).json({ msg: "User updated successfully" });
};

module.exports = { readAllUsers, readSingleUser, showCurrrentUser, updateUser };
