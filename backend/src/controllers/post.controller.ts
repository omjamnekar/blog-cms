// src/controllers/post.controller.ts
import { Request, Response } from "express";
import Post from "../model/post";
import fs from "fs";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const createPost = async (req: MulterRequest, res: Response) => {
  try {
    console.log(req.body);
    const { title, content, authorId } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newPost = new Post({
      title,
      content,
      author: authorId,
      image: imageUrl,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("author");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate("author");
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post" });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId, userId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const hasLiked = post.likedBy.includes(new mongoose.Types.ObjectId(userId));

    if (hasLiked) {
      post.likedBy = post.likedBy.filter(
        (id) => !id.equals(new mongoose.Types.ObjectId(userId))
      );
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(new mongoose.Types.ObjectId(userId));
      post.likes += 1;
    }

    await post.save();
    res.json({ likes: post.likes, likedBy: post.likedBy });
  } catch (err) {
    res.status(500).json({ message: "Failed to like/unlike post" });
  }
};

export const incrementPostViews = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    post.views += 1;
    await post.save();
    res.json({ views: post.views });
  } catch (err) {
    res.status(500).json({ message: "Failed to increment views" });
  }
};

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;
    const posts = await Post.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ],
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to search posts" });
  }
};
