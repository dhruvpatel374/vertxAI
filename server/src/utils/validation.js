const validator = require("validator");
const validateSignupData = (req) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new Error("Please enter all the fields");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email");
  } else if (password.length < 8) {
    throw new Error("Password should be greater than 8 characters");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password should contain at least one lowercase, one uppercase, one number and one special character"
    );
  }
};
const validateLoginData = (req) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Please enter all the fields");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email");
  }
};
module.exports = { validateSignupData, validateLoginData };
