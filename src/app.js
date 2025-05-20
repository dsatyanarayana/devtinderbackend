const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const { validateSignUpData, validateSignInData } = require("./utils/validator");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registration form
app.post("/signup", async (req, res) => {
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
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    //Validate SIGNIN
    validateSignInData(req);
    const userData = await User.findOne({ email: email });
    if (userData) {
      const comparePassword = await bcrypt.compare(password, userData.password);
      if (comparePassword) {
        // Create JWT Token
        const jwtToken = await jwt.sign({ _id: userData._id }, "SATYA@12345");

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
app.post("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(400).send({ status: "fail", message: "Invalid Token!" });
    }
    const verifyToken = await jwt.verify(token, "SATYA@12345");
    const result = await User.findById(verifyToken._id);
    if (result) {
      res.send(result);
    } else {
      res.status(400).send({ status: "fail", message: "No record found" });
    }
  } catch (e) {
    res.send("something went wrong!");
  }
});

// All users list
app.post("/users", async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (allUsers) {
      res.send(allUsers);
    } else {
      res.status(400).send({ status: "fail", message: "Record not available" });
    }
  } catch (e) {
    res.send({ status: "fail", message: "Something went wrong!" });
  }
});

// Delete User
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const deleteData = await User.findByIdAndDelete(userId);
    if (deleteData) {
      res.status(200).send({ status: "ok", details: "Deleted successfully" });
    } else {
      res.status(400).send({ status: "fail", details: "No record found" });
    }
  } catch (e) {
    res.status(400).send({ status: "fail", message: "Something went wrong" });
  }
});

// Update user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  const ALLOWED_UPDATES = ["photoUrl", "skills"];
  const updatedFields = Object.keys(req.body).every((d) =>
    ALLOWED_UPDATES.includes(d)
  );
  if (!updatedFields) {
    res.status(400).send({ status: "fail", details: "Invalid Input Fields!" });
  }
  try {
    const updateData = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    if (updateData) {
      res.status(200).send({ status: "ok", details: "Updated successfully!" });
    } else {
      res
        .status(400)
        .send({ status: "fail", details: "Not record to update!" });
    }
  } catch (e) {
    res
      .status(400)
      .send({ status: "fail", details: "Something went wrong!" + e.message });
  }
});

connectDB()
  .then(() => {
    console.log("DB Connection Successfully!");
    app.listen("8080", () => {
      console.log("Server Listen Started!");
    });
  })
  .catch(() => {
    console.log("DB Connection Failed!");
  });
