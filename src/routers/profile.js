const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { validateSignUpData, validateSignInData } = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/userAuth");

// Registration form
router.post("/signup", async (req, res) => {
  try {
    // Valdate signup field
    validateSignUpData(req);
    const { firstName, lastName, email, gender, password } = req.body;
    // Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = User({
      firstName,
      lastName,
      email,
      gender,
      password: passwordHash,
    });
    await user.save();
    res
      .status(200)
      .send({ status: "ok", details: "User Created Successfully!" });
  } catch (e) {
    res.status(400).send({ status: "failed", message: "ERROR" + e.message });
  }
});

// Signin API
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    //Validate SIGNIN
    validateSignInData(req);
    const userData = await User.findOne({ email: email });
    if (userData) {
      const comparePassword = await userData.camparePassword(password)
      if (comparePassword) {
        // Create JWT Token
        const jwtToken = await userData.generateJWTToken()

        // Share the JWT token in response.
        res.cookie("token", jwtToken);
        res.status(200).send({ status: "ok", message: "Login Successfully!" });
      } else {
        res
          .status(400)
          .send({ status: "fail", message: "Invalid Credentials! " });
      }
    } else {
      res.status(400).send({ status: "fail", message: "Invalid Credentials!" });
    }
  } catch (e) {
    res.status(400).send({ status: "fail", message: e.message });
  }
});

// Users Profile
router.post("/profile", userAuth, async (req, res) => {
  try {
    const result = req.user;
    if (result) {
      res.send(result);
    } else {
      res.status(400).send({ status: "fail", message: "No record found" });
    }
  } catch (e) {
    res.send("something went wrong!");
  }
});

module.exports = {router}