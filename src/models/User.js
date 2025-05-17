const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    required: true,
    validate(value) {
      if (["Male", "Female", "Others"].includes(value)) {
        throw new Error("Invalid Gender Data!");
      }
    },
  },
});

module.exports = mongoose.model("User", userSchema);
