export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath?: string;
  author: User;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  content: string;
  user: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostCreateData {
  title: string;
  content: string;
  authorId?: string;
  image?: File;
}

export interface CommentCreateData {
  user: string;
  content: string;
}

export interface CommentUpdateData {
  content: string;
}