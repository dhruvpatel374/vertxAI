const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.json({ message: "Profile data fetched successfully", data: req.user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const { age, gender } = req.body;
    const user = req.user;

    if (!age || !["male", "female", "other"].includes(gender)) {
      return res
        .status(400)
        .json({ message: "Valid age and gender are required" });
    }

    user.age = age;
    user.gender = gender;

    if (!user.profileCompleted) {
      user.profileCompleted = true;
      user.credits += 50;
      user.creditHistory.push({ amount: 50, reason: "Profile Completion" });
    }

    await user.save();

    res.json({ message: "Profile updated", data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/credits", authMiddleware, async (req, res) => {
  try {
    res.json({
      credits: req.user.credits,
      creditHistory: req.user.creditHistory,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await req.user.populate("savedPosts");
    res.json({
      message: "User dashboard data fetched successfully",
      data: {
        credits: user.credits,
        creditHistory: user.creditHistory,
        savedPosts: user.savedPosts,
        recentActivity: user.recentActivity,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
