const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const Post = require("../models/post");
const User = require("../models/user");

const feedRouter = express.Router();

// Get feed posts
feedRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ message: "Posts fetched successfully", data: posts });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Save a post
feedRouter.post("/:id/save", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = req.user;
    if (!user.savedPosts.includes(post._id)) {
      user.savedPosts.push(post._id);
      user.credits += 5;
      user.creditHistory.push({ amount: 5, reason: "Saved Post" });
      user.recentActivity.push({ action: `Saved post: ${post._id}` });
      await user.save();
    }
    res.json({ message: "Post saved" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Report a post
feedRouter.post("/:id/report", authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: "Reason is required" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.reported = true;
    post.reportReason = reason;
    await post.save();
    req.user.recentActivity.push({
      action: `Reported post: ${post._id} for "${reason}"`,
    });
    await req.user.save();
    res.json({ message: "Post reported" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Share a post
feedRouter.get("/:id/share", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = req.user;
    const shareLink = `https://yourapp.com/post/${post._id}`;
    const hasShared = user.recentActivity.some(
      (activity) => activity.action === `Shared post: ${post._id}`
    );
    if (!hasShared) {
      user.credits += 5;
      user.creditHistory.push({ amount: 5, reason: "Shared Post" });
      user.recentActivity.push({ action: `Shared post: ${post._id}` });
      await user.save();
      res.json({
        message: "Post shared and reward granted",
        data: { link: shareLink },
      });
    } else {
      res.json({
        message: "Post shared (no additional reward)",
        data: { link: shareLink },
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = feedRouter;
