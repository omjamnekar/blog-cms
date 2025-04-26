import { Request, Response } from "express";
import Category from "../model/category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res.status(400).json({ message: "Category already exists" });
      return;
    }
    const category = new Category({
      name: name,
      createdAt: Date.now().toString(),
    });

    console.log(name);
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error });
  }
};

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to get categories", error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const catId = req.params.id;
    const deleteCategory = await Category.deleteOne({ _id: catId });

    res.status(203).json({ mesage: "Record is deleted" });
  } catch (err) {
    res.status(500).json({ message: "Fail to delete category: ", err });
  }
};
