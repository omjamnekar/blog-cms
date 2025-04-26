import { Request, Response } from "express";
import Comment from "../model/comment";

export const addComment = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
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

export const updateCommenet = async (req: Request, res: Response) => {
  try {
    const { postId, commentId } = req.params;
    const { comment } = req.body;

    const updatedComment = await Comment.updateOne(
      { _id: commentId, postId: postId },
      { $set: { content: comment, updatedAt: Date.now() } }
    );

    res.status(202).json({ dataUpdated: "data is updated" });
  } catch (err) {
    res.status(500).json({ message: `There is error: ${err}` });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { postId, commentId } = req.params;
    const deleteComment = await Comment.deleteOne({
      _id: commentId,
      postId: postId,
    });
    res
      .status(203)
      .json({ message: `Comment is deleted:${deleteComment.acknowledged}` });
  } catch (err) {
    res.status(500).json({ message: `There is error: ${err}` });
  }
};
