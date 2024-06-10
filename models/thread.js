const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Thread", threadSchema);
