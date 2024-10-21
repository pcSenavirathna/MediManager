import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all schedules
const getAllSchedules = async () => {
  const response = await axios.get(`${API_URL}/schedules`);
  return response.data;
};

// Create a new schedule
const createSchedule = async (scheduleData) => {
  const response = await axios.post(`${API_URL}/schedules`, scheduleData);
  return response.data;
};

// Update a schedule by ID
const updateSchedule = async (id, scheduleData) => {
  const response = await axios.put(`${API_URL}/schedules/${id}`, scheduleData);
  return response.data;
};

// Delete a schedule by ID
const deleteSchedule = async (id) => {
  const response = await axios.delete(`${API_URL}/schedules/${id}`);
  return response.data;
};

const scheduleService = {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};

export default scheduleService;
