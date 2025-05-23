const { verifyToken } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    console.log("no token");
  }
  try {
    const { userId, role } = verifyToken({ token });
    req.user = { userId, role };
    next();
  } catch (error) {
    console.log("no token present", error);
    return res.status(400).json({ msg: "something went wrong" });
  }
};

const authorizePermission = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(401).json({ msg: "unathorized" });
    //   console.log("hi");
    next();
  };
};

module.exports = { authenticateUser, authorizePermission };
