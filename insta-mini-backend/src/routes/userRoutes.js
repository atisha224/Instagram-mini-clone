const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Follow a user
 */
router.post("/follow/:id", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const targetUserId = req.params.id;

  if (userId === targetUserId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    res.json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Follow failed" });
  }
});

/**
 * Unfollow a user
 */
router.post("/unfollow/:id", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const targetUserId = req.params.id;

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    user.following = user.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await targetUser.save();

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unfollow failed" });
  }
});

module.exports = router;
