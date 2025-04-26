import axios from 'axios';
import { Comment, CommentCreateData, CommentUpdateData } from '../types';

const API_URL = 'http://localhost:5000/api';

export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await axios.get<Comment[]>(`${API_URL}/comments/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error(axios.isAxiosError(error) 
      ? error.response?.data?.message || 'Failed to fetch comments' 
      : 'Failed to fetch comments');
  }
};

export const createComment = async (
  token: string, 
  postId: string, 
  commentData: CommentCreateData
): Promise<Comment> => {
  try {
    const response = await axios.post<Comment>(
      `${API_URL}/comments/${postId}`,
      commentData,
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
      ? error.response?.data?.message || 'Failed to create comment' 
      : 'Failed to create comment');
  }
};

export const updateComment = async (
  token: string, 
  postId: string, 
  commentId: string, 
  commentData: CommentUpdateData
): Promise<Comment> => {
  try {
    const response = await axios.patch<Comment>(
      `${API_URL}/comments/${postId}/${commentId}`,
      commentData,
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
      ? error.response?.data?.message || 'Failed to update comment' 
      : 'Failed to update comment');
  }
};

export const deleteComment = async (
  token: string, 
  postId: string, 
  commentId: string
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/comments/${postId}/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error(axios.isAxiosError(error) 
      ? error.response?.data?.message || 'Failed to delete comment' 
      : 'Failed to delete comment');
  }
};