
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAllDoctors = async () => {
  const response = await axios.get(`${API_URL}/doctor`);
  return response.data;
};

const getDoctorById = async (id) => {
  const response = await axios.get(`${API_URL}/doctor/${id}`);
  return response.data;
};

const createDoctor = async (doctorData) => {
    console.log(doctorData);
  const response = await axios.post(`${API_URL}/doctor`, doctorData);
  
  return response.data;
};

const updateDoctor = async (id, doctorData) => {
  const response = await axios.put(`${API_URL}/doctor/${id}`, doctorData);
  return response.data;
};

const deleteDoctor = async (id) => {
  const response = await axios.delete(`${API_URL}/doctor/${id}`);
  return response.data;
};

const doctorService = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};

export default doctorService;
