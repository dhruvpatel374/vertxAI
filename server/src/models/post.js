const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ["x", "reddit"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  externalId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reported: {
    type: Boolean,
    default: false,
  },
  reportReason: {
    type: String,
  },
});

module.exports = mongoose.model("Post", postSchema);
