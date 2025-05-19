const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();
app.use(express.json());

// Registration form
app.post("/signup", async (req, res) => {
  const user = User(req.body);
  try {
    await user.save();
    res
      .status(200)
      .send({ status: "ok", details: "User Created Successfully!" });
  } catch (e) {
    res.status(400).send({ status: "failed", message: e.message });
  }
});

// Find the user
app.post("/user", async (req, res) => {
  try {
    const result = await User.findOne(req.body);
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
