import Comment from "../models/comment.js";

// Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      ticket: req.params.ticketId,
      user: req.user.id,
      text,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get comments for ticket
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      ticket: req.params.ticketId,
    }).populate("user", "name");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
