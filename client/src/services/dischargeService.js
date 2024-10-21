import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const createDischarge = async (dischargeData) => {
    const response = await axios.post(`${API_URL}/discharge`, dischargeData);
    return response.data;
};

const getDischargeByPatientId = async (patientId) => {
    const response = await axios.get(`${API_URL}/discharge/${patientId}`);
    return response.data;
};

// New method to mark a discharge as paid
const markDischargeAsPaid = async (dischargeId) => {
    const response = await axios.put(`${API_URL}/discharge/mark-paid/${dischargeId}`);
    return response.data;
};

const dischargeService = {
    createDischarge,
    getDischargeByPatientId,
    markDischargeAsPaid, // Add the new method to the service
};

export default dischargeService;
