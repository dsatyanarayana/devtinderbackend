const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();
app.use(express.json());
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
