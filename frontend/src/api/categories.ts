import axios from 'axios';
import { Category } from '../types';

const API_URL = 'http://localhost:5000/api';

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    throw new Error(axios.isAxiosError(error) 
      ? error.response?.data?.message || 'Failed to fetch categories' 
      : 'Failed to fetch categories');
  }
};

export const createCategory = async (token: string, name: string): Promise<Category> => {
  try {
    const response = await axios.post<Category>(
      `${API_URL}/categories`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(axios.isAxiosError(error) 
      ? error.response?.data?.message || 'Failed to create category' 
      : 'Failed to create category');
  }
};

export const deleteCategory = async (token: string, categoryId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/categories/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error(axios.isAxiosError(error) 
      ? error.response?.data?.message || 'Failed to delete category' 
      : 'Failed to delete category');
  }
};