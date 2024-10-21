import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getPatientByEmail = async (email) => {
  const response = await axios.get(`${API_URL}/patient/email/${email}`);
  return response.data;
};

const getPatientById = async (id) => {
  const response = await axios.get(`${API_URL}/patient/${id}`);
  return response.data;
};

const patientService = {
    getPatientByEmail,
    getPatientById
  };
  
  export default patientService;