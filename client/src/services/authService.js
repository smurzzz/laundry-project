import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({ baseURL: API_BASE_URL });

export const loginRequest = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerRequest = async (payload) => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};

export const registerAdminRequest = async (payload) => {
  const response = await api.post('/auth/register-admin', payload);
  return response.data;
};

export const googleAuthRequest = async (tokenId) => {
  const response = await api.post('/auth/google', { tokenId });
  return response.data;
};

export const apiClient = axios.create({ baseURL: API_BASE_URL });

