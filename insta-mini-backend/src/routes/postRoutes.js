const express = require("express");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Create Post
 */
router.post("/", authMiddleware, async (req, res) => {
  const { imageUrl, caption } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  try {
    const post = await Post.create({
      user: req.user.id,
      imageUrl,
      caption,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Post creation failed" });
  }
});

/**
 * Like / Unlike Post
 */
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
      await post.save();
      return res.json({ message: "Post unliked" });
    }

    post.likes.push(userId);
    await post.save();
    res.json({ message: "Post liked" });
  } catch (error) {
    res.status(500).json({ message: "Like operation failed" });
  }
});

/**
 * Add Comment
 */
router.post("/:id/comment", authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user.id,
      text,
    });

    await post.save();
    res.json({ message: "Comment added" });
  } catch (error) {
    res.status(500).json({ message: "Comment failed" });
  }
});

module.exports = router;

const User = require("../models/User");

/**
 * Get Feed
 */

router.get("/feed", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const posts = await Post.find({
      user: { $in: user.following },
    })
      .populate("user", "username")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feed" });
  }
});
