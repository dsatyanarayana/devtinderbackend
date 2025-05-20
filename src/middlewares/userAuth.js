const jwt = require("jsonwebtoken");
const User = require("../models/User");
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(400).send({ status: "fail", message: "Invalid Token" });
  }
  const decodedData = await jwt.verify(token, "SATYA@12345");
  const userDetails = await User.findById(decodedData._id);
  if (!userDetails) {
    res.status(400).send({ status: "fail", message: "Not user Found!" });
  }
  req.user = userDetails;
  next();
};

module.exports = {
  userAuth,
};
