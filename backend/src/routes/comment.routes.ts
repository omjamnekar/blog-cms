import express from "express";
import {
  deleteComment,
  addComment,
  getCommentsByPost,
  updateCommenet,
} from "../controllers/comment.controller";
import { authenticate } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/:postId", authenticate, addComment);
router.get("/:postId", getCommentsByPost);
router.patch("/:postId/:commentId", updateCommenet);
router.delete("/:postId/:commentId", authenticate, deleteComment);

export default router;
