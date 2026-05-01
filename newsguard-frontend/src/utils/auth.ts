import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export const setToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  setToken('');
  window.location.href = '/signin';
};

export const isAuthenticated = () => {
  return !!getToken();
};
