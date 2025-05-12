const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();

app.post("/signup", async(req, res) => {
    const user = User({
        firstName: "Rahul",
        lastName: "R",
        email: "rahul@gmail.com"
    })
    try{
        await user.save();
        res.status(200).send({status:'ok',details:'User Created Successfully!'})
    }
    catch(e){
        res.status(400).send({status:'failed',message:e.message})
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
