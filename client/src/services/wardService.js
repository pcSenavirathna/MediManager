
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAllWards = async () => {
  const response = await axios.get(`${API_URL}/ward`);
  return response.data;
};

const getWardById = async (id) => {
  const response = await axios.get(`${API_URL}/ward/${id}`);
  return response.data;
};

const updateBedOccupancy = async (wardNo, bedNo, isOccupied, patientId) => {
  const response = await axios.put(`${API_URL}/ward/bed/occupancy`, { wardNo, bedNo, isOccupied, patientId });
  return response.data;
};

const wardService = {
  getAllWards,
  getWardById,
  updateBedOccupancy,
};

export default wardService;
