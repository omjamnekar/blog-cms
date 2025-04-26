import axios from 'axios';
import { Post, PostCreateData } from '../types';

const API_URL = 'http://localhost:5000/api';

export const getPosts = async (token: string, category?: string): Promise<Post[]> => {
  try {
    const url = category 
      ? `${API_URL}/posts?category=${category}` 
      : `${API_URL}/posts`;
    
    const response = await axios.get<Post[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(axios.isAxiosError(error) 
      ? error.response?.data?.message || 'Failed to fetch posts' 
      : 'Failed to fetch posts');
  }
};

export const getPostById = async (token: string, postId: string): Promise<Post> => {
  try {
    const response = await axios.get<Post>(`${API_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(axios.isAxiosError(error) 
      ? error.response?.data?.message || 'Failed to fetch post' 
      : 'Failed to fetch post');
  }
};

export const createPost = async (token: string, postData: PostCreateData): Promise<Post> => {
  try {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('authorId', postData.authorId || '');
    
    if (postData.image) {
      formData.append('image', postData.image);
    }
    
    const response = await axios.post<Post>(`${API_URL}/posts`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(axios.isAxiosError(error) 
      ? error.response?.data?.message || 'Failed to create post' 
      : 'Failed to create post');
  }
};