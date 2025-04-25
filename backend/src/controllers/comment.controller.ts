// backend/src/controllers/comment.controller.ts

import { Request, Response } from "express";
import Comment from "../model/category";

// Create a new comment for a post
export const addComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { user, content } = req.body;

    const newComment = new Comment({
      postId,
      user,
      content,
    });

    await newComment.save();
    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
};

// Get all comments for a specific post
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
};
