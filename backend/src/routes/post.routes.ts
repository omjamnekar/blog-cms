import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
} from "../controllers/post.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../utils/multer";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", authenticate, upload.single("file"), createPost);

export default router;
