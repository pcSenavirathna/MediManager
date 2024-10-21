import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const getAllAppointments = async () => {
    const response = await axios.get(`${API_URL}/appointments`);
    return response.data;
};


const createAppointment = async (appointmentData) => {
    const response = await axios.post(`${API_URL}/appointments`, appointmentData);
    return response.data;
};


const updateAppointment = async (id, appointmentData) => {
    const response = await axios.put(`${API_URL}/appointments/${id}`, appointmentData);
    return response.data;
};


const deleteAppointment = async (id) => {
    const response = await axios.delete(`${API_URL}/appointments/${id}`);
    return response.data;
};

const appointmentService = {
    getAllAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};

export default appointmentService;
