const express = require("express");
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: passwordHash,
      credits: 10,
      creditHistory: [{ amount: 10, reason: "Daily Login" }],
      lastLogin: new Date(),
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    // sending token in cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.json({ message: "User saved successfully", data: savedUser });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    const today = new Date().setHours(0, 0, 0, 0);
    const lastLogin = user.lastLogin
      ? new Date(user.lastLogin).setHours(0, 0, 0, 0)
      : null;
    if (!lastLogin || today > lastLogin) {
      user.credits += 10;
      user.creditHistory.push({ amount: 10, reason: "Daily Login" });
      user.lastLogin = new Date();
      await user.save();
    }
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.json({ message: "User logged in successfully", data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/", sameSite: "None", secure: true });
  res.json({ message: "User logged out successfully" });
});

module.exports = authRouter;
