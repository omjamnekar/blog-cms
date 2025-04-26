import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/category.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express();

router.post("/", authenticate, createCategory);
router.get("/", getAllCategories);
router.delete("/:id", deleteCategory);

export default router;
