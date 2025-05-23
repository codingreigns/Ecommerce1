const { User } = require("../models/userModel");
const { createJwtToken, attachCookieToRes } = require("../utils/jwt");
const { validateNewUser, validateUserLogin } = require("../validation");

const login = async (req, res) => {
  const {
    error,
    value: { email, password },
  } = validateUserLogin(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: error.details[0].message });
  // does password match
  const isValidPassword = user.compareHashedPassword(password);
  if (!isValidPassword)
    return res.status(400).json({ msg: error.details[0].message });
  // attach cookie to res
  const payload = { userId: user._id, role: user.role };
  attachCookieToRes({ res, payload });
  return res.json({ msg: "success", user });
};

const logout = async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(Date.now()) });
  return res.json({ msg: "success" });
};

const register = async (req, res) => {
  const {
    error,
    value: { name, email, password },
  } = validateNewUser(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  //   check if user exists
  const user = await User.findOne({ email });
  if (user)
    return res.status(400).json({
      msg: "user already exists, please try to register with different email",
    });
  // first user as admin
  const isAdmin = await User.countDocuments();
  const role = isAdmin === 0 ? "admin" : "user";

  const newUser = await User.create({ name, email, password, role });
  const payload = { userId: newUser._id, role: newUser.role };
  const token = createJwtToken({ payload });

  //   sending the token via cookie
  attachCookieToRes({ res, payload });
  return res.json({ msg: "success", user: newUser });
};

module.exports = { login, logout, register };
