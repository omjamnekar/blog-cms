import axios from 'axios';
import { LoginCredentials, RegisterCredentials, User } from '../types';

const API_URL = 'http://localhost:5000/api';

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(axios.isAxiosError(error) 
      ? error.response?.data?.message || 'Login failed' 
      : 'Login failed');
  }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(axios.isAxiosError(error) 
      ? error.response?.data?.message || 'Registration failed' 
      : 'Registration failed');
  }
};