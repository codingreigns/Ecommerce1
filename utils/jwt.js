const jwt = require("jsonwebtoken");
require("dotenv/config");

const createJwtToken = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
  return token;
};

const verifyToken = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookieToRes = async ({ res, payload }) => {
  const oneDay = 1000 * 3600 * 24;
  const token = createJwtToken({ payload });
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production" ? true : false,
    signed: true,
  });
};

const checkAuthorization = (req, userId) => {
  const userRole = req.user.role;
  const isTheSameUser = req.user.userId === userId;
  if (userRole !== "admin" && !isTheSameUser) {
    return false;
  }
  return true;
};

module.exports = {
  verifyToken,
  createJwtToken,
  attachCookieToRes,
  checkAuthorization,
};
