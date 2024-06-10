const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Thread = require("../models/thread");
const Comment = require("../models/comment");

// カテゴリーの取得
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// カテゴリー内のスレッドの取得
router.get("/categories/:id/threads", async (req, res) => {
  try {
    const threads = await Thread.find({ category: req.params.id });
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// スレッドの取得
router.get("/threads/:id", async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id)
      .populate("comments")
      .exec();
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

// スレッドの作成
router.post("/threads", async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const newThread = new Thread({ title, description, category });
    await newThread.save();
    res.status(201).json(newThread);
  } catch (error) {
    res.status(500).json({ error: "Failed to create thread" });
  }
});

// スレッドへのコメントの追加
router.post("/threads/:id/comments", async (req, res) => {
  try {
    const { content, name } = req.body;
    const newComment = new Comment({ thread: req.params.id, content, name });
    await newComment.save();

    const thread = await Thread.findById(req.params.id);
    thread.comments.push(newComment);
    await thread.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

module.exports = router;
