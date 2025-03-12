const express = require("express");
const Message = require("../models/ChatModel");
const { protect } = require("../middleware/authMiddleware");

const messageRouter = express.Router();

// Send Message
messageRouter.post("/", protect, async (req, res) => {
  try {
    const { content, groupId } = req.body;

    // Create the message
    const message = await Message.create({
      sender: req.user._id,
      content,
      group: groupId,
    });

    // Populate sender details
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "username email"
    );

    // Send response
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//get message for a group
messageRouter.get("/:groupId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate("sender", "username email")
      .sort({ created: -1 });
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.Message });
  }
});

module.exports = messageRouter;
