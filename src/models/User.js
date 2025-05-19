const mongoose = require("mongoose");
const validator = require("validator")
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 80,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email ID")
        }
    }
  },
  password: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 15,
  },
  age: {
    type: Number,
    trim: true,
    min: 18,
  },
  gender: {
    type: String,
    required: true,
    validate(value) {
      if (!["Male", "Female", "Others"].includes(value)) {
        throw new Error("Invalid Gender Data!");
      }
    },
  },
},{timestamp:true});

module.exports = mongoose.model("User", userSchema);
