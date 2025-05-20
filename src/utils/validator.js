const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, password, email, gender } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please enter Name!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Strong password required!");
  }
};

const validateSignInData = (req) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Strong password required!");
  }
};

module.exports = {
  validateSignUpData,
  validateSignInData,
};
