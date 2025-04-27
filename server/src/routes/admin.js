const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const User = require("../models/user");
const Post = require("../models/post");

const adminRouter = express.Router();

adminRouter.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("name email credits profileCompleted savedPosts creditHistory");
    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

adminRouter.patch(
  "/users/:id/credits",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { credits, reason } = req.body;

      // Check if credits and reason are provided
      if (
        credits === undefined ||
        credits === null ||
        reason === undefined ||
        reason === null ||
        reason.trim() === ""
      ) {
        return res
          .status(400)
          .json({ message: "Credits and reason are required" });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const amount = credits - user.credits;
      user.credits = credits;
      user.creditHistory.push({ amount, reason });
      await user.save();

      res.json({ message: "Credits updated", data: user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

adminRouter.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments({ role: "user" });
      const reportedPosts = await Post.find({ reported: true }).select(
        "source content reportReason createdAt"
      );
      res.json({
        message: "Admin dashboard data fetched successfully",
        data: { totalUsers, reportedPosts },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = adminRouter;
