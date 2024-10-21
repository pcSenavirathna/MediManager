import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all staff members
const getAllStaff = async () => {
  const response = await axios.get(`${API_URL}/staff`);
  return response.data;
};

// Get a single staff member by ID
const getStaffById = async (id) => {
  const response = await axios.get(`${API_URL}/staff/${id}`);
  return response.data;
};

// Create a new staff member
const createStaff = async (staffData) => {
  const response = await axios.post(`${API_URL}/staff`, staffData);
  return response.data;
};

// Update a staff member by ID
const updateStaff = async (id, staffData) => {
  const response = await axios.put(`${API_URL}/staff/${id}`, staffData);
  return response.data;
};

// Delete a staff member by ID
const deleteStaff = async (id) => {
  const response = await axios.delete(`${API_URL}/staff/${id}`);
  return response.data;
};

const staffService = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};

export default staffService;
