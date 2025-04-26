import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  incrementPostViews,
  likePost,
} from "../controllers/post.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../utils/multer";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", authenticate, upload.single("file"), createPost);
router.post("/:postId/like/:userId", likePost);
router.post("/:id", incrementPostViews);
export default router;
