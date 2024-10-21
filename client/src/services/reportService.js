import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const generateStaffReport = async () => {
  const response = await axios.get(`${API_URL}/reports/staff`);
  return response.data;
};

const reportService = {
  generateStaffReport,
};

export default reportService;