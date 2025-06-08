const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email ID");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 50) {
          throw new Error("Skills should not exceed 50");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL" + value);
        }
      },
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
  },
  { timestamps: true }
);

userSchema.methods.generateJWTToken = async function () {
  const token = await jwt.sign({ _id: this._id }, "SATYA@12345", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.camparePassword = async function(password){
    const comparePassword =  await bcrypt.compare(password, this.password);
    return comparePassword;
}

module.exports = mongoose.model("User", userSchema);
