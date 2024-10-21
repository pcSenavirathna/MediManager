
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getLastWeekAppointmentCount = async () => {
  try {
    const response = await axios.get(`${API_URL}/appointments/count`);
    return response.data;
  } catch (error) {
    console.error('Error fetching last week appointment count:', error);
    throw error;
  }
};

export default {
  getLastWeekAppointmentCount,
};
