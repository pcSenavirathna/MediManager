import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

const register = async (name, email, password, userType, medicalHistory, phone) => {
  const response = await axios.post(`${API_URL}/patient`, { name, email, password, userType, medicalHistory, phone });
  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;