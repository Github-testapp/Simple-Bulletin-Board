const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  content: { type: String, required: true },
  name: { type: String, default: "匿名" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
